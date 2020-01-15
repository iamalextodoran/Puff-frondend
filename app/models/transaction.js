import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  category: DS.attr(),
  name: DS.attr(),
  description: DS.attr(),
  amount: DS.attr(),
  date: DS.attr(),
  typeOfT: DS.attr(),
  user: DS.belongsTo('user')
});
