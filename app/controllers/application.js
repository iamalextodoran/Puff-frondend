import Controller from '@ember/controller';

export default Controller.extend({
  init(){  
    this._super(...arguments);
    this.get('store').findRecord('user', 42).then(currentUser => {
      if (currentUser.darkMode) {
        this.set('darkMode', currentUser.darkMode);
        document.body.classList.add("darkMode");
      } else {
        document.body.classList.remove("darkMode");
      }
     });
  }
});