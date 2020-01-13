import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  selectedUser: computed(function() {
    return this.get('store').findAll('currentuser')
  }),

  init(){  
    this._super(...arguments);
    let id = 42;
    this.get('store').findRecord('user', id).then(item => {
      if (item.darkMode) {
        this.set('darkMode', item.darkMode);
        document.body.classList.add("darkMode");
      } else {
        document.body.classList.remove("darkMode");
      }
      this.set('currentUser', item);
     });
  },

  actions: {
    changeUser: function(user) {
      let now = new Date()
      this.set('currentUser', user);
      this.set('currentUser.selectedAt', now);
      this.get('currentUser').save()
    },
  }
});