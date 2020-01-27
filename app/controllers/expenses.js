/* eslint-disable ember/no-side-effects */
/* eslint-disable ember/use-brace-expansion */
/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  // init() {
  //   this._super(...arguments);
  //   this.get('expensesFetched');
  // },
  // expensesWithFetch: null, 
  // currentMonthExpensesWithFetch: null,
  // expensesFetched: computed(async function() {
  //   return fetch('transactions/all_expenses')
  //     .then((response) => {
  //       return response.json();
  //     }).then(item => {
  //       this.set('expensesWithFetch', item.allExpenses);
  //       return item.allExpenses;
  //     });
  // }),

  categoryOptions: ['food', 'travel', 'savings', 'transportation', 'utilities', 'medical'],
  
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
    return this.get('transactions').filterBy('typeOfT','expense').sortBy('date').reverse()
  }),

  // then filter expenses by the current month
  currentMonthExpenses: computed('expenses', function() {
    return this.get('expenses').filter(expense => {
      return new Date(expense.get('date')).getMonth() === new Date().getMonth();
    });
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
      description: description,
      user: this.get('selectedUser'),

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
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ['food', 'travel', 'savings', 'transportation', 'utilities', 'medical'],
    };
  }),

  showDeleteDialog: false,
  actions: {
    editButton() {
      this.set('showEditDialog', true);
    },

    confirmEdit() {
      this.get('currentExpense').save().then( ()=> {
        this.set("showEditDialog", false);
      })
    },

    showEditDialogAction(expense) {
      this.set('currentExpense', expense);
      this.set("showEditDialog", true);
    },

    closeEditDialogAction() {
      this.set("showEditDialog", false);
    },


    deleteButton() {
      this.set('showDeleteDialog', true);
    },

    confirmDelete() {
      this.get('currentExpense').destroyRecord();
      this.set('showDeleteDialog', false);
    },

    showDeleteDialogAction(expense) {
      this.set('currentExpense', expense);
      this.set("showDeleteDialog", true);
    },

    closeDeleteDialogAction() {
      this.set("showDeleteDialog", false);
    },

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
