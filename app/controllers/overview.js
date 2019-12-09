import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  priorityOptions: computed('model', function() {
    return {
      datasets: [
        {
          data: 'test'
        }
      ],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    };
  }),

  test: computed(function(){
    return this.get('store').findAll('transaction')
  }),

  actions: {
    targetButton: function() {}
  }
});
 