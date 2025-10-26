export default {
  getListActions() {
    // find all function in this object have end is Action
    return Object.keys(this)
      .filter((key) => key.endsWith('Action'))
      .map((key) => key.replace('Action', ''));
  },

  async run(workflowAction: any): Promise<any> {
    const actionName = workflowAction.name + 'Action';
    if (this[actionName]) {
      return this[actionName](workflowAction);
    } else {
      console.log('Action not found...', actionName);
      return null;
    }
  },

  async Send_EmailAction(workflowAction: any): Promise<any> {
    console.log('Sending email...', workflowAction);
    return workflowAction;
  },

  async Send_SmsAction(workflowAction: any): Promise<any> {
    console.log('Sending sms...', workflowAction);
    return workflowAction;
  },
};
