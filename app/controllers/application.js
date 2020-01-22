/* eslint-disable ember/no-side-effects */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  currentId: 42,
  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  // selectedUser: computed(function() {
  //   return this.get('store').findAll('currentuser');
  // }),

  selectedUser: computed('users.length', function() {
    return this.get('users').sortBy('selectedAt').reverse().objectAt(0);
  }),

  init(){  
    this._super(...arguments);

    let id = this.get('currentId');
    this.get('store').findRecord('user', id).then(item => {
      if (item.darkMode) {
        document.body.classList.add("darkMode");
      } else {
        document.body.classList.remove("darkMode");
      }
    });
  },

  actions: {
    changeUser: function(user) {
      let now = new Date()
      this.set('currentUser', user);
      this.set('currentId', user.id);
      this.set('currentUser.selectedAt', now);
      this.get('currentUser').save();
      location.reload(); //refresh page
    },
  }
});