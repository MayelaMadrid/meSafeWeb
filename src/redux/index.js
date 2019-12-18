import { combineReducers } from 'redux';
import Usuarios from '../modules/usuarios/reducer';
import Reports from '../modules/reports/reducer';


export default combineReducers({
  Usuarios,
  Reports
});