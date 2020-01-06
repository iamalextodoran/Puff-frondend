/* eslint-disable ember/use-brace-expansion */
/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  categoryOptionsForIncome: ['work', 'freelance', 'scolarship'],
  
  transactions: computed(function() {
    return this.get('store').findAll('transaction');
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

  // now map all of this month's expenses by their amounts:
  currentMonthIncomesAmounts: computed('currentMonthIncomes', function() {
    return this.get('currentMonthIncomes').mapBy('amount');
  }),

  // now sum all of the current month's expense amounts:
  sumOfCurrentMonthIncomes: computed('currentMonthIncomesAmounts', function() {
    return this.get('currentMonthIncomesAmounts').reduce((a, b) => a + b, 0);
  }),

  //all time incomes sum
  incomesSum: computed('incomes.length', 'incomes.@each.amount', function() {
    return this.get('incomes').mapBy('amount').reduce((a, b) => a + b, 0)
  }),



  workSum: computed('currentMonthIncomes.length', 'currentMonthIncomes.@each.amount', function() {
    return this.get('currentMonthIncomes').filterBy('category', 'work').mapBy('amount').reduce((a, b) => a + b, 0);
  }),

  scolarshipSum: computed('currentMonthIncomes.length', 'currentMonthIncomes.@each.amount', function() {
    return this.get('currentMonthIncomes').filterBy('category', 'scolarship').mapBy('amount').reduce((a, b) => a + b, 0);
  }),

  freelanceSum: computed('currentMonthIncomes.length', 'currentMonthIncomes.@each.amount', function() {
    return this.get('currentMonthIncomes').filterBy('category', 'freelance').mapBy('amount').reduce((a, b) => a + b, 0);
  }),

  barValue: computed('sumOfCurrentMonthIncomes', 'workSum', 'scolarshipSum', 'freelanceSum', function() {
    let a = this.get('workSum'),
        b = this.get('scolarshipSum'),
        c = this.get('freelanceSum'),
        d = this.get('incomesSum');
  
    return {
      work: a/d,
      scolarship: b/d,
      freelance: c/d
    }
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