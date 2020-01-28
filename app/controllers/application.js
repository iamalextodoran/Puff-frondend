/* eslint-disable ember/no-side-effects */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  selectedUser: computed('users.length', function() {
    return this.get('users').sortBy('selectedAt').reverse().objectAt(0);
  }),

  init(){  
    this._super(...arguments);

    this.get('store').findRecord('user', 42).then(item => {
      if (item.darkMode) {
        // document.body.classList.add("darkMode");
      } else {
        // document.body.classList.remove("darkMode");
      }
    });
  },

  actions: {
    changeUser: function(user) {
      let now = new Date()
      this.set('currentUser', user);
      this.set('currentUser.selectedAt', now);
      this.get('currentUser').save();
      
      location.reload(); //refresh page
    },

    darking: function() {
      document.body.classList.toggle("darkMode");

      let check = document.getElementById('logo').src;
      if(check.indexOf('logo-white.png') != -1) {
        document.getElementById('logo').src = 'assets/images/logo-white.png'
      } else {
        document.getElementById('logo').src = 'assets/images/logo-black.png'
      }
    }
  }
});