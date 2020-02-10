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
  accent: localStorage.getItem('accent'),

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
      this.set('showSubmitChangesToast', true);
    },

    closePromptDialog: function() {
      this.set('showChangePictureDialog', false)
    },

    closeSubmitChangesToast: function() {
      this.set('showSubmitChangesToast', false)
    },

    openChangePictureDialog: function() {
      this.set('showChangePictureDialog', true)
    },

    colorOnChange(hsva) {
      String.prototype.replaceAt=function(index, replacement) {
        return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
      }

      let color = hsva.toRGBA().toString();
      let n = color.length-2;
      let trailColor = color.replaceAt(n, "0.5)");

      localStorage.setItem('color', color);
      localStorage.setItem('trail', trailColor);

      document.documentElement.style.setProperty("--bar-color", color);
      document.documentElement.style.setProperty("--bar-trail-color", trailColor);
    },

    accentOnChange(hsva) {
      document.documentElement.style.setProperty("--accent-color", hsva.toRGBA().toString());
      localStorage.setItem('accent', hsva.toRGBA().toString());
    }

  }
});