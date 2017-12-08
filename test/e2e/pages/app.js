'use strict';
const commands = {
	doThis: function(){
    console.log('doThis');
    return this;
  }
};

module.exports = {
	url: function() {
		return this.api.globals.baseUrl;
	},
	commands: [commands],
	elements: {
		viewHeader: '.pxh-view-header__title',
    header: '.pxh-view-header__title-link',
		spinner: '.pxh-spinner'
	}
};
