export default {
  routes: [
    {
      method: 'POST',
      path: '/telecoms/twilio/send-sms',
      handler: 'twilio.sendSMS',
    },
    {
      method: 'POST',
      path: '/telecoms/twilio/sms-handler',
      handler: 'twilio.smsHandler',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/telecoms/twilio/voice-handler',
      handler: 'twilio.voiceHandler',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/telecoms/twilio/status-handler',
      handler: 'twilio.statusHandler',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/telecoms/twilio/assignment-handler',
      handler: 'twilio.assignmentHandler',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/telecoms/twilio/dequeue',
      handler: 'twilio.dequeueHandler',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/telecoms/twilio/token',
      handler: 'twilio.getToken',
    },
  ],
};
