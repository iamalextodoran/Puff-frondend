/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
/* eslint-disable ember/use-brace-expansion */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  dangerValue: 1000,
  darkMode: false,

  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  actions: {
    darkModeToggle: function() {
      this.store.findRecord('user', 42).then(function(user) {
        user.toggleProperty('darkMode');
        user.save();
      });
      location.reload();
    }
  }
});