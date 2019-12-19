/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
/* eslint-disable ember/use-brace-expansion */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  categoryOptions: ['food', 'travel', 'savings', 'transportation', 'utilities', 'medical'],
  isBad: false,

  currentUser: computed(function() {
    return this.get('store').findRecord('user', 42);
  }),

  transactions: computed(function() {
    return this.get('store').findAll('transaction');
  }),

  expenses: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('transactions').filterBy('typeOfT','expense')
  }),

  incomes: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('transactions').filterBy('typeOfT','income')
  }),

  expensesSorted: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('transactions').filterBy('typeOfT','expense').sortBy('amount').reverse()
  }),

// categories returning max amount spent and name
  foodSorted: computed('expensesSorted',function(){
    return this.get('expensesSorted').filterBy('category','food').objectAt(0)
  }),

  savingsSorted: computed('expensesSorted',function(){
    return this.get('expensesSorted').filterBy('category','savings').objectAt(0)
  }),

  travelSorted: computed('expensesSorted',function(){
    return this.get('expensesSorted').filterBy('category','travel').objectAt(0)
  }),

  transportationSorted: computed('expensesSorted',function(){
    return this.get('expensesSorted').filterBy('category','transportation').objectAt(0)
  }),

  utilitiesSorted: computed('expensesSorted',function(){
    return this.get('expensesSorted').filterBy('category','utilities').objectAt(0)
  }),
  medicalSorted: computed('expensesSorted',function(){
    return this.get('expensesSorted').filterBy('category','medical').objectAt(0)
  }),
  
  //expenses and incomes sum
  expenseSum: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('expenses').mapBy('amount').reduce((a, b) => a + b, 0)
  }),
  
  incomeSum: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('incomes').mapBy('amount').reduce((a, b) => a + b, 0)
  }),
  //savings and travel sums saved for bar use as an object
  savingSum: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('expenses').filterBy('category', 'savings').mapBy('amount').reduce((a, b) => a + b, 0);
  }),

  travelSum: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('expenses').filterBy('category', 'travel').mapBy('amount').reduce((a, b) => a + b, 0);
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

  allSavingsValue: computed('savingSum', 'travelSum', function() {
    return this.get('savingSum') + this.get('travelSum')
  }),

  barValue: computed('allSavingsValue', 'savingSum', 'travelSum', function() {
    let a = this.get('savingSum'),
        b = this.get('travelSum'),
        c = this.get('allSavingsValue');
    return {
      saving: a/c,
      travel: b/c
    }
  }),

  actions: {
    goToPerson: function() {
      document.body.classList.toggle("darkMode");
      let img = document.getElementById('mode').src;
      if (img.indexOf('white.png')!=-1) {
        document.getElementById('mode').src = 'assets/images/logo-black.png';
      }
      else {
        document.getElementById('mode').src = 'assets/images/logo-white.png';
      }
    },

    addQuickExpense: function() {
      this.set('showPromptAddExpense', true)
    },

    closePromptDialog: function() {
      this.set('showPromptAddExpense', false)
    },
    
    addExpense: function() {
      const expense = this.get('createExpense');
      this.set('lastExpense', expense);
      this.set('showPromptAddExpense', false);
      this.setProperties({
        name: '',
        amount: '',
        category: '',
        description: ''
      });
    }
  }
});
