import _ from 'lodash';

export const createLoadingSelector = (actions) => (state) =>
  // returns true only when all actions are finished loading
  _(actions).some((action) => _.get(state, `apiStatus.loading.${action}`));

export const createErrorMessageSelector = (actions) => (state) =>
  // returns the first error messages for actions
  // * We assume when any request fails on a page that
  //   requires multiple API calls, we show the first error
  _(actions)
    .map((action) => _.get(state, `apiStatus.error.${action}`))
    .compact()
    .first() || '';
