/* eslint-disable ember/use-brace-expansion */
/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  categoryOptions: ['food', 'travel', 'savings', 'transportation', 'utilities', 'medical'],
  
  transactions: computed(function() {
    return this.get('store').findAll('transaction');
  }),

  expenses: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('transactions').filterBy('typeOfT','expense').sortBy('date')
  }),

  expenseSum: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('expenses').mapBy('amount').reduce((a, b) => a + b, 0)
  }),

  date: computed(function() {
    let today = new Date();
    return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  }),

  createExpense: computed(function() {
    var name = this.get('name');
    var amount = this.get('amount');
    var date = this.get('date');
    var category = this.get('category');
    var description = this.get('description');

    var newExpense = this.store.createRecord('transaction', {
      typeOfT: 'expense',
      name: name,
      amount: amount,
      date: new Date(date),
      category: category,
      description: description
    });
    return newExpense.save()
  }),

  expData: computed('expenses.length', 'expenses.@each.category', function(){
    return {
      food: this.get('expenses').filterBy('category','food').mapBy('amount').reduce((a, b) => a + b, 0),
      savings: this.get('expenses').filterBy('category','savings').mapBy('amount').reduce((a, b) => a + b, 0),
      travel: this.get('expenses').filterBy('category','travel').mapBy('amount').reduce((a, b) => a + b, 0),
      transportation: this.get('expenses').filterBy('category','transportation').mapBy('amount').reduce((a, b) => a + b, 0),
      utilities: this.get('expenses').filterBy('category','utilities').mapBy('amount').reduce((a, b) => a + b, 0),
      medical: this.get('expenses').filterBy('category','medical').mapBy('amount').reduce((a, b) => a + b, 0)
    }
  }),

  priorityOptions: computed('expData', function() {
    return {
      datasets: [
        {
          data: [this.get('expData.food'), this.get('expData.travel'), this.get('expData.savings'), this.get('expData.transportation'), this.get('expData.utilities'), this.get('expData.medical')],
          backgroundColor: [
            'rgba(255, 99, 132)',
            'rgba(54, 162, 235)',
            'rgba(255, 206, 86)',
            'rgba(75, 192, 192)',
            'rgba(153, 102, 255)',
            'rgba(255, 159, 64)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ['food', 'travel', 'savings', 'transportation', 'utilities', 'medical'],
    };
  }),

  actions: {
    targetButton() {},

    undoAddExpense() {
      this.get('lastExpense.content').destroyRecord();
      this.set('addExpenseToast', false);
      this.set('undoAddExpenseToast', true);
    },

    addExpense: function() {
      const expense = this.get('createExpense');
      this.set('lastExpense', expense);
      this.setProperties({
        name: '',
        amount: '',
        category: '',
        description: ''
      });
    
      this.set('addExpenseToast', true);
    },

    closeAddToast() {
      this.set('addExpenseToast', false);

    },
    closeUndoToast(){
      this.set('undoAddExpenseeToast', false);
    }
  }
});
