module.exports = {
  url() {
    return `${this.api.globals.baseUrl}/login`;
  },
  elements: {
    logout: '#logoutBtn2',
    form: '#loginForm',
    error: '.error-message',
    endpoint: '#loginForm #endpointInput',
    token: '#loginForm #tokenInput',
    submit: '#loginForm button[type=submit]'
  }
};
