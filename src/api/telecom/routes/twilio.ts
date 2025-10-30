export default {
  routes: [
    {
      method: 'POST',
      path: '/telecoms/twilio/voice',
      handler: 'twilio.voiceHandler',
      config: {
        auth: false,
      },
    },
  ],
};
