import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  categoryOptionsForIncome: ['work', 'scolarship', 'freelance'],
  
  transactions: computed(function() {
    return this.get('store').findAll('transaction');
  }),

  date: computed(function() {
    let today = new Date();
    return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  }),

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
    });
    return newIncome.save()
  }),

  // eslint-disable-next-line ember/use-brace-expansion
  incomeSum: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('transactions').filterBy('typeOfT','income').mapBy('amount').reduce((a, b) => a + b, 0)
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