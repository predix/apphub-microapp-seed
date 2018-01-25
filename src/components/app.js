
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
      <div class="pxh-view pxh-view--wide@md pxh-view--narrow@lg">
        <div class="u-p">

          <div class="px-card u-mb">
            <header>Overview</header>
            <section>
              <p>This simple micro-app seed contains just enough to get you started.</p>
              <p>Some features include:</p>
              <ul>
                <li>Webpack</li>
                <li>Swagger</li>
                <li>Express</li>
                <li>ES6 with Babel</li>
                <li>and more...</li>
              </ul>
            </section>
          </div>


          <div class="px-card u-mb">
            <header>Webpack</header>
            <section>
              <p>We are using Webpack building the client-side, which makes adding any framework of very easy.</p>
              <p>Simply install the framework of choice using <code>npm</code>, import that library in your application and your ready to go.</p>
              <p>There might be some minor configuration changes to match your applications needs. <a target="_blank" href="https://webpack.js.org/configuration/">https://webpack.js.org/configuration</a></p>
            </section>
          </div>

          <div class="px-card u-mb">
            <header>Swagger API</header>
            <section>
              <p>You can modify the <code>api.yaml</code> file is located in the <code>server/common/swagger</code> directory.</p>
              <p>You can also explore the API using the <a href="/api-explorer" target="_blank">API Explorer</a></p>
            </section>
          </div>

          <div class="px-card u-mb">
            <header>Notifications</header>
            <section>
              <p>When this micro-app is running in AppHub you can test the toast notifications.</p>
              <button id="toastBtn" class="btn btn-primary">New Toast</button>
            </section>
          </div>

          <div class="px-card u-mb">
            <header>Authentication</header>
            <section>
              <p>This micro-app also has built in authentication using UAA. When running inside AppHub this is already taken care of.</p>
              <p>If you want to use your own UAA authentication, you can set the following environment variables.</p>
              <pre>
UAA_URL             = https://uaa-instance.predix-uaa.run.aws-usw02-pr.ice.predix.io
UAA_CALLBACK_URL    = http://localhost:9000/oauth/callback
UAA_CLIENT_ID       = test-client
UAA_CLIENT_SECRET   = test
              </pre>

              <a href="/login" class="btn">Login</a>
              <a href="/userinfo" class="btn">User Info</a>
              <a href="/logout" class="btn">Logout</a>
            </section>
          </div>





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
        //isPersistent : true,
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
