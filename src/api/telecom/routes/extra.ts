export default {
  routes: [
    {
      method: 'POST',
      path: '/telecoms/sms/send',
      handler: 'telecom.sendSMS',
    },
  ],
};
