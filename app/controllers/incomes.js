/* eslint-disable ember/no-side-effects */
/* eslint-disable ember/use-brace-expansion */
/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  categoryOptionsForIncome: ['work', 'freelance', 'scolarship'],
  
  users: computed(function() {
    return this.get('store').peekAll('user');
  }),

  selectedUser: computed('users.length', function() {
    return this.get('users').sortBy('selectedAt').reverse().objectAt(0);
  }),

  // transactions: computed('selectedUser', function() {
  //   return this.get('selectedUser.transactions');
  // }),

  // incomes: computed('transactions.length', 'transactions.@each.amount', function() {
  //   return this.get('transactions').filterBy('typeOfT','income')
  // }),

  // // then filter expenses by the current month
  // currentMonthIncomes: computed('incomes', function() {
  //   return this.get('incomes').filter(incomes => {
  //     return new Date(incomes.get('date')).getMonth() === new Date().getMonth();
  //   });
  // }),

  // sumOfCurrentMonthIncomes: computed('currentMonthIncomes', function() {
  //   return this.get('currentMonthIncomes').mapBy('amount').reduce((a, b) => a + b, 0);
  // }),

  // incomesTotal: computed('currentMonthIncomes', function() {
  //   let a = this.get('currentMonthIncomes').filterBy('category', 'work').mapBy('amount').reduce((a, b) => a + b, 0),
  //       b = this.get('currentMonthIncomes').filterBy('category', 'scolarship').mapBy('amount').reduce((a, b) => a + b, 0),
  //       c = this.get('currentMonthIncomes').filterBy('category', 'freelance').mapBy('amount').reduce((a, b) => a + b, 0),
  //       d = this.get('currentMonthIncomes').mapBy('amount').reduce((a, b) => a + b, 0);
  
  //   return {
  //     work: a/d,
  //     scolarship: b/d,
  //     freelance: c/d,
  //     total: d
  //   }
  // }),

  createIncome: computed(function() {
    var name = this.get('name');
    var amount = this.get('amount');
    var date = this.get('date');
    var category = this.get('category');

    var newIncome = this.store.createRecord('transaction', {
      typeOfT: 'income',
      name: name,
      amount: amount,
      date: new Date(date),
      category: category,
      user: this.get('selectedUser'),
    });
    return newIncome.save()
  }),

  actions: {
    undoAddIncome() {
      this.get('lastIncome.content').destroyRecord();
      this.set('addIncomeToast', false);
      this.set('undoAddIncomeToast', true);
    },

    addIncome: function() {
      const income = this.get('createIncome');
      this.set('lastIncome', income);
      this.setProperties({
        name: '',
        amount: '',
        category: '',
      });
    
      this.set('addIncomeToast', true);
    },

    closeAddToast() {
      this.set('addIncomeToast', false);

    },
    closeUndoToast(){
      this.set('undoAddIncomeToast', false);
    }
  }
}); 