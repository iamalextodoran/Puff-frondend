import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  transactions: computed(function() {
    return this.get('store').findAll('transaction');
  }),

  // eslint-disable-next-line ember/use-brace-expansion
  expenses: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('transactions').filterBy('typeOfT','expense')
  }),
  
  // eslint-disable-next-line ember/use-brace-expansion
  expenseSum: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('expenses').mapBy('amount').reduce((a, b) => a + b, 0)
  }),

  // eslint-disable-next-line ember/use-brace-expansion
  savingSum: computed('transactions.length', 'transactions.@each.amount', function() {
    let sum = this.get('expenses').filterBy('category', 'savings').mapBy('amount').reduce((a, b) => a + b, 0);
    return {
      progress: sum/1000,
      sum: sum
    }
  }),
  // eslint-disable-next-line ember/use-brace-expansion
  foodTest: computed('expenses.length', 'expenses.@each.category', function() {
    return Math.max.apply(Math, this.get('expenses').filterBy('category','food').mapBy('amount'))
  }),

  // eslint-disable-next-line ember/use-brace-expansion
  travelSum: computed('transactions.length', 'transactions.@each.amount', function() {
    let sum = this.get('expenses').filterBy('category', 'travel').mapBy('amount').reduce((a, b) => a + b, 0);
    return {
      progress: sum/1000,
      sum: sum
    }
  }),
  // eslint-disable-next-line ember/use-brace-expansion
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
    targetButton: function() {}
  }
});
 