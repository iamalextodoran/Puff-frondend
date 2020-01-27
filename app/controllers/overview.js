/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
/* eslint-disable ember/use-brace-expansion */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  categoryOptions: ['food', 'travel', 'savings', 'transportation', 'utilities', 'medical'],

  isBad: computed('currentMonthIncomes', 'currentMonthExpenses', 'selectedUser', function() {
    let incomes = this.get('currentMonthIncomes').mapBy('amount').reduce((a, b) => a + b, 0);
    let expenses = this.get('currentMonthExpenses').mapBy('amount').reduce((a, b) => a + b, 0);
    let total = incomes-expenses;

    let dangerValue = this.get('selectedUser.danger');
    if (total < dangerValue) {
      return true;
    } else {
      return false;
    }
  }),

  users: computed(function() {
    return this.get('store').peekAll('user');
  }),

  selectedUser: computed('users.length', function() {
    return this.get('users').sortBy('selectedAt').reverse().objectAt(0);
  }),

  transactions: computed('selectedUser', function() {
    return this.get('selectedUser.transactions');
  }),

  expenses: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('transactions').filterBy('typeOfT','expense');
  }),

  // then filter expenses by the current month
  currentMonthExpenses: computed('expenses', function() {
    return this.get('expenses').filter(expense => {
      return new Date(expense.get('date')).getMonth() === new Date().getMonth();
    });
  }),

  incomes: computed('transactions.length', 'transactions.@each.amount', function() {
    return this.get('transactions').filterBy('typeOfT','income')
  }),

  // then filter expenses by the current month
  currentMonthIncomes: computed('incomes', function() {
    return this.get('incomes').filter(incomes => {
      return new Date(incomes.get('date')).getMonth() === new Date().getMonth();
    });
  }),

  status: computed('currentMonthIncomes', 'currentMonthExpenses', function(){
    let incomes = this.get('currentMonthIncomes').mapBy('amount').reduce((a, b) => a + b, 0);
    let expenses = this.get('currentMonthExpenses').mapBy('amount').reduce((a, b) => a + b, 0);
    let total = incomes-expenses;
    let percentage = (total/incomes*100).toFixed(2);
    return {
      incomes: incomes,
      expenses: expenses,
      total: total,
      percentage: percentage
    }
  }),

  topSpendings: computed('currentMonthExpenses', function(){
    return [
      this.get('currentMonthExpenses').filterBy('category','food').sortBy('amount').reverse().objectAt(0),
      this.get('currentMonthExpenses').filterBy('category','savings').sortBy('amount').reverse().objectAt(0),
      this.get('currentMonthExpenses').filterBy('category','travel').sortBy('amount').reverse().objectAt(0),
      // this.get('currentMonthExpenses').filterBy('category','transportation').sortBy('amount').reverse().objectAt(0),
      // this.get('currentMonthExpenses').filterBy('category','utilities').sortBy('amount').reverse().objectAt(0),
      // this.get('currentMonthExpenses').filterBy('category','medical').sortBy('amount').reverse().objectAt(0)
    ]
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
      user: this.get('selectedUser'),
      date: new Date(date),
      category: category, 
      description: description
    });
    return newExpense.save()
  }),

  expensesChart: computed('currentMonthExpenses.length', 'currentMonthExpenses.@each.category', function() {
    return {
      datasets: [
        {
          data: [
          this.get('currentMonthExpenses').filterBy('category','food').mapBy('amount').reduce((a, b) => a + b, 0),
          this.get('currentMonthExpenses').filterBy('category','savings').mapBy('amount').reduce((a, b) => a + b, 0),
          this.get('currentMonthExpenses').filterBy('category','travel').mapBy('amount').reduce((a, b) => a + b, 0),
          this.get('currentMonthExpenses').filterBy('category','transportation').mapBy('amount').reduce((a, b) => a + b, 0),
          this.get('currentMonthExpenses').filterBy('category','utilities').mapBy('amount').reduce((a, b) => a + b, 0),
          this.get('currentMonthExpenses').filterBy('category','medical').mapBy('amount').reduce((a, b) => a + b, 0)
          ],
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
      labels: ['food', 'travel', 'savings', 'transportation', 'utilities', 'medical'],
    };
  }),

  savedMoney: computed('expenses', function() {
    let a = this.get('expenses').filterBy('category', 'savings').mapBy('amount').reduce((a, b) => a + b, 0),
        b = this.get('expenses').filterBy('category', 'travel').mapBy('amount').reduce((a, b) => a + b, 0),
        c = a+b;
    return {
      saving: a/c,
      travel: b/c,
      total: c
    }
  }),
  currentTopExpense: computed(function() {
    return this.get('foodSorted')
  }),

  actions: {
    showExpenseDetails: function(item) {
      this.set('currentTopExpense', item)
      this.set('showExpenseDialog', true);
    },

    addQuickExpense: function() {
      this.set('showPromptAddExpense', true)
    },

    closePromptDialog: function() {
      this.set('showPromptAddExpense', false)
    },

    closeAnimatedDialog: function() {
      this.set('showExpenseDialog', false)
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
