/* eslint-disable ember/no-side-effects */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
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

  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  selectedUser: computed('users.length', function() {
    return this.get('users').sortBy('selectedAt').reverse().objectAt(0);
  }),

  actions: {
    changeUser: function(user) {
      let now = new Date();
      this.set('currentUser', user);
      this.set('currentUser.selectedAt', now);
      this.get('currentUser').save();
      
      location.reload(); //refresh page
    },
    showCreateUserDialog: function() {
      this.set('showCreateUser', true);
    },

    createUser: function() {
      let now = new Date();

      this.store.createRecord('user', {
        fullName: this.get('fullName'),
        danger: this.get('danger'),
        picture: this.get('picture'),
        selectedAt: now,
      }).save();

      this.set('showCreateUser', false);
    },

    closeDialog: function() {
      this.set('showCreateUser', false);
    },

    darking: function() {
      let darkMode = localStorage.getItem('darkMode'); 
      const enableDarkMode = () => {
        document.body.classList.add('darkMode');
        localStorage.setItem('darkMode', 'enabled');
        document.getElementById('thisGuy').src = 'assets/images/logo-white.png'
      }
      const disableDarkMode = () => {
        document.body.classList.remove('darkMode');
        localStorage.setItem('darkMode', null);
        document.getElementById('thisGuy').src = 'assets/images/logo-black.png'
      }
      darkMode = localStorage.getItem('darkMode'); 
      
      if (darkMode !== 'enabled') {
        enableDarkMode();
      } else {  
        disableDarkMode(); 
      }
    }
  }
});