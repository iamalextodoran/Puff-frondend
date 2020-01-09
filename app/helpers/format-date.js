import { helper } from '@ember/component/helper';

export default helper(function formatDate(params/*, hash*/) {
  return moment().format('LL');
});


