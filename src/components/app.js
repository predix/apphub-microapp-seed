
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
    <div class="u-p">
      <div class="card">
        <header>Micro App Base</header>
        <section>
        This is a simple micro app that contains just enough to get you started.
        </section>
      </div>
    </div>
    `;
  }
}
