/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
/* eslint-disable ember/use-brace-expansion */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

let color = {
  red: Math.floor(Math.random() * 255),
  green: Math.floor(Math.random() * 255),
  blue: Math.floor(Math.random() * 255)
};

export default Controller.extend({
  color,
  dangerValue: 1000,

  colorStyle: computed('color.{red,green,blue}', function() {
    return (`border: 1px solid #333; background: rgb(${this.get('color.red')}, ${this.get('color.green')}, ${this.get('color.blue')})`);
  }),
  
  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  currentUser: computed(function() {
    return this.get('store').findRecord('user', 42)
  }),

  actions: {
    unkown: function() {
    },

    darkModeToggle: function() { 
      this.get('currentUser').save().then( ()=> {
        this.set("darkMode", true);
      })
    }
  }
});