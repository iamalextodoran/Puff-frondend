/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
/* eslint-disable ember/use-brace-expansion */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  users: computed(function() {
    return this.get('store').peekAll('user');
  }),

  selectedUser: computed('users.length', function() {
    return this.get('users').sortBy('selectedAt').reverse().objectAt(0);
  }),

  actions: {
    submit: function() {
      this.store.findRecord('user', this.get('selectedUser.id')).then(function(user) {
        user.save();
      });
      location.reload();
    },
  }
});