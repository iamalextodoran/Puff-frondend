import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  fullName: DS.attr(),
  picture: DS.attr(),
  darkMode: DS.attr(),
  selectedAt: DS.attr('date')
});