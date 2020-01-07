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
  accentColorToggle: true,
  carryOverEnabled: true,
  currencyToggle:false,
  dangerValue: 1000,
  userNames: ['Alex Todoran', 'Munte Vlad', 'David Bautista', 'John Cena'],

  colorStyle: computed('color.{red,green,blue}', function() {
    return (`border: 1px solid #333; background: rgb(${this.get('color.red')}, ${this.get('color.green')}, ${this.get('color.blue')})`);
  }),
  
  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  currentUser: computed('users.length', 'users.@each', function(){
    return this.store.findRecord('user', 42).then(item => {
      return item.fullName
    })
  }),

  actions: {
    goToUser: function() {
    },
    
    userState: function() {
    },

    darkModeToggle: function() {  
    }
  }
});