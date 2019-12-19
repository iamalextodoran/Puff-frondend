import { helper } from '@ember/component/helper';

export default helper(function formatDate(params/*, hash*/) {
  return params.moment().format('LL');
});

