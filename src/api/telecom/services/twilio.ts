import twilio from 'twilio';

export default {
  async getSettings() {
    const settings = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'twilio');
    return settings?.twilio || {};
  },

  async getClient(settings?: any) {
    settings = settings || (await this.getSettings());
    const { accountSid, authToken } = settings;

    if (!accountSid || !authToken) {
      throw new Error('Twilio accountSid and authToken are required');
    }

    return twilio(accountSid, authToken);
  },

  async getAccessToken(
    identity: string,
    workspaceSid?: string,
    workerSid?: string,
    settings?: any,
  ) {
    settings = settings || (await this.getSettings());
    const { accountSid, apiKey, apiSecret, twimlAppSid } = settings;

    if (!accountSid || !apiKey || !apiSecret || !twimlAppSid) {
      throw new Error(
        'Twilio accountSid, apiKey, apiSecret, and twimlAppSid are required',
      );
    }

    const token = new twilio.jwt.AccessToken(accountSid, apiKey, apiSecret, {
      identity: identity,
    });

    const voiceGrant = new twilio.jwt.AccessToken.VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
    });

    token.addGrant(voiceGrant);

    if (workerSid && workspaceSid) {
      const taskRouterGrant = new twilio.jwt.AccessToken.TaskRouterGrant({
        workspaceSid: workspaceSid,
        workerSid: workerSid,
        role: 'worker',
      });

      token.addGrant(taskRouterGrant);
    }

    return token.toJwt();
  },

  async getChildrenCalls(callSid: string) {
    const client = await this.getClient();

    const calls = await client.calls.list({
      parentCallSid: callSid,
    });

    return calls;
  },

  async voiceHandler(params: any) {
    const twiml = new twilio.twiml.VoiceResponse();
    if (!params.To || !params.From) {
      twiml.say('Invalid request.');
      return twiml.toString();
    }

    let caller = '';
    let phoneNumber = params.From;
    if (phoneNumber.indexOf(':') > 0) {
      caller = phoneNumber.split(':')[0];
      phoneNumber = phoneNumber.split(':')[1];
    }

    let Direction = 'outbound';
    if (caller !== 'client') {
      Direction = 'inbound';
    }

    if (Direction === 'inbound') {
      return await this.inboundCallHandler(params);
    }

    return await this.outboundCallHandler(phoneNumber, params);
  },

  async outboundCallHandler(phoneNumber: string, params: any) {
    const twiml = new twilio.twiml.VoiceResponse();
    const dial = twiml.dial({ callerId: phoneNumber });

    if (params.To) {
      dial.number(params.To);
    } else {
      twiml.say('No destination number provided.');
    }

    return twiml.toString();
  },

  async inboundCallHandler(params: any) {
    const settings = await this.getSettings();

    const { workflowSid } = settings;

    if (workflowSid) {
      return await this.inboundCallTaskRouter(params, workflowSid);
    }

    const twiml = new twilio.twiml.VoiceResponse();

    let phoneNumber = params.To;
    if (phoneNumber.indexOf(':') > 0) {
      phoneNumber = phoneNumber.split(':')[1];
    }

    twiml.say('Connecting to agent.');
    twiml.dial().client(phoneNumber);

    return twiml.toString();
  },

  async inboundCallTaskRouter(params: any, workflowSid: string) {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Please wait while we connect you to the next available agent.');

    const enqueue = twiml.enqueue({ workflowSid });
    enqueue.task(
      {
        priority: 1,
        timeout: 3600,
      },
      JSON.stringify({
        // customer_name: 'John Doe',
        To: params.To,
        From: params.From,
        call_sid: params.CallSid,
      }),
    );

    return twiml.toString();
  },

  async statusCallback(params: any) {
    const { CallSid } = params;

    if (!CallSid) {
      return;
    }

    const calls = await this.getChildrenCalls(CallSid);
    if (!calls || calls.length === 0) {
      return;
    }

    const settings = await this.getSettings();
    const { phoneNumber } = settings;

    calls.forEach(async (call) => {
      let from = call.from;
      if (from.indexOf(':') > 0) {
        from = from.split(':')[1];
      }

      let to = call.to;
      if (to.indexOf(':') > 0) {
        to = to.split(':')[1];
      }

      let direction = 'inbound';
      if (from === phoneNumber) {
        direction = 'outbound';
      }

      strapi.db
        .query('api::telecom.telecom')
        .create({
          data: {
            service: 'twilio',
            sid: call.sid,
            type: 'call',
            direction,
            from,
            to,
            duration: parseInt(call.duration),
            type_status: call.status,
            start_time: new Date(call.startTime),
            end_time: new Date(call.endTime),
            answered_by: call.answeredBy || '',
            meta: call,
          },
        })
        .then(() => {
          // Handle success
        })
        .catch((error) => {
          console.error('Error creating telecom record:', error);
        });
    });
  },

  async taskrouterAssignmentCallback(
    params: any,
    returnType: string = 'twiml',
  ) {
    const { WorkerSid, TaskAttributes } = params;
    const { From } = JSON.parse(TaskAttributes) || {};

    const twiml = new twilio.twiml.VoiceResponse();

    if (!WorkerSid) {
      if (returnType === 'twiml') {
        twiml.say('Invalid request.');
        return twiml.toString();
      }
      return {};
    }

    const user = await strapi.db
      .query('api::user-permission.user-permission')
      .findOne({
        where: {
          worker_sid: WorkerSid,
        },
      });

    if (!user) {
      if (returnType === 'xml') {
        twiml.say('Invalid request.');
        return twiml.toString();
      }
      return {};
    }

    const identity = user.email || user.name;

    if (returnType === 'twiml') {
      twiml.say('Connecting to agent.');
      twiml.dial().client(identity);
      return twiml.toString();
    }

    const settings = await this.getSettings();
    const { postWorkActivitySid } = settings;

    return {
      instruction: 'dequeue',
      post_work_activity_sid: postWorkActivitySid,
      to: `client:${identity}`,
      from: From,
    };
  },

  async dequeueStatusCallback(params: any) {
    const {
      WorkflowSid,
      WorkspaceSid,
      TaskSid,
      TaskAssignmentStatus,
      EventType,
    } = params;

    if (
      !TaskSid ||
      !WorkspaceSid ||
      !WorkflowSid ||
      !EventType ||
      !TaskAssignmentStatus
    ) {
      return { message: 'invalid request' };
    }

    if (EventType === 'task.wrapup' && TaskAssignmentStatus === 'wrapping') {
      const client = await this.getClient();
      await client.taskrouter.v1
        .workspaces(WorkspaceSid)
        .tasks(TaskSid)
        .update({
          assignmentStatus: 'completed',
        });
      return { message: 'completed', TaskAssignmentStatus };
    }

    return { message: 'no action', TaskAssignmentStatus };
  },

  async sendSms(
    { to, body },
    userId: number,
    module?: string,
    recordId?: number,
  ) {
    const settings = await this.getSettings();
    const { phoneNumber: from } = settings;

    try {
      const client = await this.getClient(settings);
      const message = await client.messages.create({
        body,
        from,
        to,
      });

      const messageData = message.toJSON();

      return await strapi.db.query('api::telecom.telecom').create({
        data: {
          type: 'sms',
          service: 'twilio',
          sid: message.sid,
          metadata: messageData,
          from,
          to: message.to,
          direction: 'outbound',
          type_status: message.status,
          assigned_user: userId,
          module,
          record_id: recordId || null,
        },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  async receiveSMS(
    data = {
      ToCountry: '',
      ToState: '',
      SmsMessageSid: '',
      NumMedia: '0',
      ToCity: '',
      FromZip: '',
      SmsSid: '',
      FromState: '',
      SmsStatus: 'received',
      FromCity: '',
      Body: 'body',
      FromCountry: 'US',
      To: '+1...',
      ToZip: '',
      NumSegments: '1',
      MessageSid: '',
      AccountSid: '',
      From: '+1...',
      ApiVersion: '2010-04-01',
    },
  ) {
    if (data.SmsMessageSid) {
      await strapi.db.query('api::telecom.telecom').create({
        data: {
          type: 'sms',
          direction: 'inbound',
          from: data.From,
          to: data.To,
          body: data.Body,
          service: 'Twilio',
          sid: data.SmsSid,
          metadata: data,
        },
      });
    }

    // return xml response
    return '<Response></Response>';
  },
};
