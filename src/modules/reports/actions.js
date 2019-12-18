import axios from 'axios';
import * as types from './actionTypes';

export const getReportsTest = () => async dispatch => {
  let config = {
    headers: {
      authorization: "bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjI3NTNlYjMzMTUyNDdlNWFkY2ExMjRiMTQ2OTczNDY3IiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NzQ5MTI1MTcsImV4cCI6MTU3NDkxNjExNywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9yZXNvdXJjZXMiLCJtZVNhZmVBcGkiXSwiY2xpZW50X2lkIjoibWVTYWZlQXBwIiwic2NvcGUiOlsibWVTYWZlQXBpIl19.JSnt7MR62XmXBRReDOZF2NPJbUmW4wZrgFoyeQoVXMLHGTq_zhC81uUJCup6NZzUVL2XAxxHEPZ8ImB_ModIgnGvBdeuJ4tNeuAN3qh-LCck6uqoqBfT4wDmQhe9z083GKRedTq30zAWhLHzogle_x9XimZe9wjU-GJFij-WuMIiaNLcJ1BwMJgca2S0CMgjd_T6AzVJgP_lueWObyR_HgDPT7SwIY44TbFvk_CZxlatbdCKFhFM3VZiuNDToKWFaujY2mmBmnq40rS_XtA2H6NeZTVMHD0lc_zBDuucwi0vpvDf4nHkS1Gmqk3pfF9bnl5fs4eEdSu7uTccz3SPRw"
    }
  }
  const response = await axios.get('http://localhost:5100/api/reportes', config);
  dispatch({
    type: types.GET_REPORTS,
    payload: response.data
  })
  return response.data;

}

export const qualifyReport = (id, rate) => async dispatch => {
  const response = await axios.put('/api/reportes/calificar', { id, rate });
  dispatch({
    type: types.QUALIFY_REPORTS,
    payload: response.data
  })
  return response.data;
}


export const getReports = () => async dispatch => {
  const response = await axios.get('/api/reportes');
  dispatch({
    type: types.GET_REPORTS,
    payload: response.data
  })
  return response.data;
}

export const denounceReports = (id) => async dispatch => {
  const response = await axios.put(`/api/reportes/denuncia/${id}`);
  dispatch({
    type: types.DENOUNCE_REPORTS,
    payload: response.data
  })
  return response.data;
}

export const censoreReport = (id, usuario) => async dispatch => {
  const response = await axios.put('/api/reportes/censurar', { id, usuario });
  dispatch({
    type: types.CENSORE_REPORTS,
    payload: response.data
  })
  return response.data;
}

export const deleteReport = (id) => async dispatch => {
  const response = await axios.delete(`/api/reportes/${id}`);
  dispatch({
    type: types.DELETE_REPORT,
    payload: response.data
  })
  return response.data;
}

export const newAlert = (data) => async dispatch => {
  dispatch({
    type: types.NEW_ALERT,
    payload: data
  })
}
export const saveReports = (id_usuario, descripcion, fecha, ubicacion, postivos, negativos, tipo_reporte, latitud, longitud, emergencia, imagenes) => async dispatch => {

  const response = await axios.post('/api/reportes', {
    id_usuario,
    descripcion,
    fecha,
    ubicacion,
    postivos,
    negativos,
    tipo_reporte,
    latitud,
    longitud,
    emergencia,
    imagenes
  });
  dispatch({
    type: types.SAVE_REPORTS,
    payload: response.data
  })
  return response.data;
}
