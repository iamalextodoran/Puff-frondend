import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  init(){  
    this._super(...arguments);
    let id=42;
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
      this.set('currentUser', user);
      this.get('currentUser').save().then( ()=> {
        this.toggleProperty('currentUser.active')
      })
    },
  }
});