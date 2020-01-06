import Controller from '@ember/controller';
import { computed } from "@ember/object";


export default Controller.extend({
  currentUser: computed(function() {
    return this.get('store').findRecord('user', 42)
  }),

  hasDarkMode: computed('currentUser.darkMode', function() {
    return this.get('currentUser.darkMode');
  }),

  test: true,

  init(){  
    this._super(...arguments);
    if (this.get('hasDarkMode')) { 
      document.body.classList.add("darkMode");
    } else {
      document.body.classList.remove("darkMode");
    }
  }
});