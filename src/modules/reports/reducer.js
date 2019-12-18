import * as types from './actionTypes';

const initialState = {
  reports: undefined,
  saveReport: undefined,
  qualifyReport: undefined,
  denounceReport: undefined,
  censoreReport: undefined,
  deleteReport: undefined
}

const Reports = ((state, action) => {
  if (typeof state === 'undefined') {
    return initialState
  }
  switch (action.type) {
    case types.GET_REPORTS:
      return Object.assign({}, state, {
        reports: action.payload
      });
    case types.SAVE_REPORTS:
      return Object.assign({}, state, {
        saveReport: action.payload
      });
    case types.QUALIFY_REPORTS:
      return Object.assign({}, state, {
        qualifyReport: action.payload
      });
    case types.DENOUNCE_REPORTS:
      return Object.assign({}, state, {
        denounceReport: action.payload
      });
    case types.CENSORE_REPORTS:
      return Object.assign({}, state, {
        censoreReport: action.payload
      });
    case types.DELETE_REPORT:
      return Object.assign({}, state, {
        deleteReport: action.payload
      });
    default:
      return state;
  }
});

export default Reports;