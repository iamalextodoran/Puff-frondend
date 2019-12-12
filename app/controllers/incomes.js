import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  categoryOptions: ['food', 'travel', 'savings', 'transportation', 'utilities', 'medical'],

  date: computed(function() {
    let today = new Date();
    return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  }),

  transactions: computed(function() {
    return this.get('store').findAll('transaction');
  }),

  priorityOptions: computed(function() {
    return {
      datasets: [{
        data: [12, 19, 3, 5, 2, 3],
      }],
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
    }
  }),

  createIncome: computed(function() {
    var name = this.get('name');
    var amount = this.get('amount');
    var date = this.get('date');
    var category = this.get('category');
    var description = this.get('description');

    var newIncome = this.store.createRecord('transaction', {
      typeOfT: 'income',
      name: name,
      amount: amount,
      date: new Date(date),
      category: category,
      description: description
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
        date: '',
        category: '',
        description: ''
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