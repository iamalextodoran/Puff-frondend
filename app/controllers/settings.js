/* eslint-disable no-undef */
/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
/* eslint-disable ember/use-brace-expansion */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.components = {
      palette: false,  // Will be overwritten with true if preview, opacity or hue are true
      preview: true,
      opacity: false,
      hue: true,

      interaction: {
        hex: false,
        rgba: false,
        hsva: false,
        input: true,
        save: true,
        clear: false,
      }
    };
  },

  color: localStorage.getItem('color'),
  trail: localStorage.getItem('trail'),

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

    colorOnChange(hsva) {
      document.documentElement.style.setProperty("--bar-color", hsva.toHEXA().toString());
      // this.set('color', hsva.toHEXA().toString());
      localStorage.setItem('color', hsva.toHEXA().toString());
    },

    trailOnChange(hsva) {
      document.documentElement.style.setProperty("--bar-trail-color", hsva.toHEXA().toString());
      // this.set('color', hsva.toHEXA().toString());
      localStorage.setItem('trail', hsva.toHEXA().toString());
    }

  }
});