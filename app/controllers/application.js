import Controller from '@ember/controller';
import { computed } from "@ember/object";


export default Controller.extend({
  // hasDarkMode: true,

  currentUser: computed(function() {
    return this.get('store').findRecord('user', 42)
  }),

  hasDarkMode: computed(function() {
    return this.get('currentUser').then(response => {
      return response.darkMode;
    })
  }),

  init(){  
    this._super(...arguments);
    const darkModeOn = this.get('hasDarkMode');
    
    if (darkModeOn) { 
      document.body.classList.add("darkMode");
    } else {
      document.body.classList.remove("darkMode");
    }
  }
});
