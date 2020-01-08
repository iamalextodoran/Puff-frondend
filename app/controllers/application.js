import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  init(){  
    this._super(...arguments);
    this.get('store').findRecord('user', 42).then(currentUser => {
      if (currentUser.darkMode) {
        this.set('darkMode', currentUser.darkMode);
        document.body.classList.add("darkMode");
      } else {
        document.body.classList.remove("darkMode");
      }
     });
  },
  actions: {
    changeUser: function() {
      this.set('currentUser', currentUser)
    },
  }
});