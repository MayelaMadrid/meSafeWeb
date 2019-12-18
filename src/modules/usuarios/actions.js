import axios from 'axios';
import * as types from './actionTypes';

export const handleLogin = (email, password) => async dispatch => {
  const response = await axios.post('/api/auth', {
    email,
    password,
    client_id: "meSafeApp",
    scopes: "meSafeApi",
    client_secret: "SuperSecretMeSafeApiPassword",
    grant_type: "client_credentials"
  })
  dispatch({
    type: types.LOGIN,
    payload: response.data
  })
  return response.data;

}
export const handleSignUp = ({ nombres, apellidos, email, password, estado = "", municipio = "", colonia = "", genero = "", edad = "", ocupacion = "", celular = "", estatus = "" }) => async dispatch => {
  const response = await axios.post('api/users', {
    nombres,
    apellidos,
    email,
    password,
    estado,
    municipio,
    colonia,
    genero,
    edad,
    ocupacion,
    celular,
    estatus
  })

  dispatch({
    type: types.SIGNUP,
    payload: response.data
  })
}

export const getInfoUser = (id, type) => async dispatch => {
  const response = await axios.get(`/api/usuarios/${id}`)
  dispatch({
    type: type,
    payload: response.data
  })
  return response.data;
}
export const updateUser = (
  id, nombres, apellidos, edad, genero, estado, municipio, celular, password, email, colonia, ocupacion) => async dispatch => {
    const response = await axios.put(`/api/usuarios/${id}`, {
      nombres, apellidos, edad, genero, estado, municipio, celular, password, email, colonia, ocupacion, estatus: "1"
    })
    dispatch({
      type: types.UPDATE_USER,
      payload: response.data
    })
    return response.data;
  }
export const getContacts = (id) => async dispatch => {
  const response = await axios.get(`/api/conocidos/${id}`)

  dispatch({
    type: types.GET_CONTACT,
    payload: response.data
  })
  return response.data;
}
export const saveContact = (id_usuario, nombre, correo, parentesco) => async dispatch => {
  const response = await axios.post(`/api/conocidos`, {
    id_usuario, nombre, correo, parentesco
  })

  dispatch({
    type: types.SAVE_CONTACT,
    payload: response.data
  })
}

export const getHelpCenter = () => async dispatch => {
  const response = await axios.get(`/api/consejos/centros`)

  dispatch({
    type: types.GET_HELP_CENTER,
    payload: response.data
  })
  return response.data;
}

export const getTips = () => async dispatch => {
  const response = await axios.get(`/api/consejos`)

  dispatch({
    type: types.GET_TIPS,
    payload: response.data
  })
  return response.data;
}

export const getAlerts = () => async dispatch => {
  const response = await axios.get(`/api/reportes/alertas`)

  dispatch({
    type: types.GET_ALERTS,
    payload: response.data
  })
  return response.data;
}

export const showSnackbar = (message, type) => {
  return {
    type: types.SHOW_SNACKBAR,
    payload: { message, type }
  }
}

export const saveAlert = (message) => {
  return {
    type: types.SAVE_ALERT,
    payload: message
  }
}
axios.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem('token');
  if (config.url !== "api/auth" && config.url !== "api/users") {
    config.headers.Authorization = token ? `Bearer ${token}` : '';
  }
  return config;
});
