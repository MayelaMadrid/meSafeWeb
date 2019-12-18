import * as types from './actionTypes';

const initialState = {
  login: undefined,
  signup: undefined,
  userById: undefined,
  userByIdOther: undefined,
  snackbar: { message: false, type: "success" },
  alert: undefined,
  saveContact: undefined,
  getContacts: undefined,
  updateUser: undefined,
  tips: undefined,
  centers: undefined,
  alerts: undefined
}

const Usuarios = ((state, action) => {
  if (typeof state === 'undefined') {
    return initialState
  }
  switch (action.type) {
    case types.LOGIN:
      return Object.assign({}, state, {
        login: action.payload
      });
    case types.SIGNUP:
      return Object.assign({}, state, {
        signup: action.payload
      });
    case types.GET_DATA_BY_ID:
      return Object.assign({}, state, {
        userById: action.payload
      });
    case types.UPDATE_USER:
      return Object.assign({}, state, {
        updateUser: action.payload
      });
    case types.SHOW_SNACKBAR:
      return Object.assign({}, state, {
        snackbar: action.payload
      });
    case types.SAVE_ALERT:
      return Object.assign({}, state, {
        alert: action.payload
      });
    case types.GET_HELP_CENTER:
      return Object.assign({}, state, {
        centers: action.payload
      });
    case types.GET_TIPS:
      return Object.assign({}, state, {
        tips: action.payload
      });
    case types.GET_ALERTS:
      return Object.assign({}, state, {
        alerts: action.payload
      });
    case types.GET_CONTACT:
      return Object.assign({}, state, {
        getContacts: action.payload
      });
    case types.SAVE_CONTACT:
      return Object.assign({}, state, {
        saveContact: action.payload
      });
    case types.GET_DATA_BY_ID_OTHER:
      return Object.assign({}, state, {
        userByIdOther: action.payload
      });
    case types.NEW_ALERT:
      return Object.assign({}, state, {
        alerts: [...state.alerts, action.payload]
      });

    default:
      return state;
  }
});

export default Usuarios;