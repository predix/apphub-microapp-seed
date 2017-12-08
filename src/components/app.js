
/**
 * @description Vanilla JavaScript App
 */
export default class App {
  constructor(el){
    console.log('App loaded');
    this.el = el;
    this.render();
  }
  render(){
    this.el.innerHTML = `
    <div class="pxh-wrapper app">
      <div class="pxh-view-header pxh-view-header--wide@md pxh-view-header--narrow@lg pxh-view-header--nudge-until@md">
        <h1 class="pxh-view-header__title flex flex--middle flex--center">
          <a href="#" class="pxh-view-header__title-link">
            Micro-App Seed
          </a>
        </h1>
      </div>
      <div class="pxh-view pxh-view--wide@md pxh-view--narrow@lg" id="js-view">
        <div class="u-p">
          <p>This is a simple micro app that contains just enough to get you started.</p>
          <button id="toastBtn">New Toast</button>

          <p>This microapp also has built in authentication using UAA</p>
          <a href="/login">Login</a>
          <a href="/userinfo">User Info</a>
          <a href="/logout">Logout</a>
        </div>
      </div>
    </div>

    `;
    this.afterRender();
  }
  afterRender(){
    this.el.querySelector('button').addEventListener('click', this.addToast.bind(this));
  }
  addToast(){
    if(window.pxh){
      console.log('Adding toast');
      var toastObject = {
        type : 'green',
        isPersistent : true,
        icon : 'dashboard',
        text : 'Hello, this is a message for you!',
        timestamp: new Date().toString()
      };
      window.pxh.toast.add(toastObject);
    } else {
      console.warn('pxh needs to be in the window....But this will be changing');
    }
  }
}
