import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import LoginContainer from './modules/login';
import Home from './modules/usuarios/home';
import PrivateRoute from './PrivateRoute';
import CrearReporte from './modules/reports/newReport';
import MapReports from './modules/maps';
import { connect } from 'react-redux';
import * as actions from "./modules/usuarios/actions";
import { newAlert } from "./modules/reports/actions";
import Snackbar from '@material-ui/core/Snackbar';
import { MySnackbarContentWrapper } from './components/snackbar';
import * as signalR from '@aspnet/signalr';
import Linear from './modules/estadisticas/linear';
import Barras from './modules/estadisticas/barras';
import Configuration from './modules/usuarios/configuration';
import HelpCenter from './modules/usuarios/emergencyNumber';
import Revision from './modules/usuarios/revision/revision';
import MyReports from './modules/reports/myReports';

function App(props) {
  const [connection, setConnection] = useState(null);
  useEffect(() => {
    if ((localStorage.getItem("username") && localStorage.getItem("password")) || (sessionStorage.getItem("username") && sessionStorage.getItem("password"))) {
      props.onLogin(localStorage.getItem("username") || sessionStorage.getItem("username"), localStorage.getItem("password") || sessionStorage.getItem("password")).then((res) => {
        sessionStorage.setItem("token", res.token);
        localStorage.setItem("token", res.token);
        props.getById(res.usuario.id)
      })
    }
    let connection = new signalR.HubConnectionBuilder().withUrl("/reportesHub").build();
    setConnection(connection);
    connection.start()
      .then(() => console.log("Conexión establecida con éxito"))
      .catch((err) => console.log(`Error: ${err}`))
      ;

    connection.on("newReport", (message) => { props.newAlert(message) });
    if ((localStorage.getItem("username") && localStorage.getItem("password")) || (sessionStorage.getItem("username"))) {
      props.getTips();
      props.getAlerts();

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [false]);


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.showSnackbar(false, "success");
  };


  return (
    <div className="background-home">
      <Switch>
        <Route exact path='/login' component={LoginContainer} />
        <PrivateRoute connection={connection} exact path='/' component={Home} />
        <PrivateRoute connection={connection} exact path='/misReportes' component={MyReports} />
        <PrivateRoute connection={connection} exact path='/reporte/:id' component={Home} />
        <PrivateRoute connection={connection} exact path='/nuevoreporte' component={CrearReporte} />
        <PrivateRoute connection={connection} exact path='/configuracion' component={Configuration} />
        <PrivateRoute connection={connection} exact path='/mapa' component={MapReports} />
        <PrivateRoute connection={connection} exact path='/numerosTelefonicos' component={HelpCenter} />
        {(props.login && props.login.rol !== "5dede7d9406b030ee5d9c03f") || (props.userData && props.userData.id_rol !== "5dede7d9406b030ee5d9c03f") ?
          <>
            <PrivateRoute connection={connection} exact path='/revision' component={Revision} />
            <PrivateRoute connection={connection} exact path='/estadisticas/lineal' component={Linear} />
            <PrivateRoute connection={connection} exact path='/estadisticas/barras' component={Barras} />
          </> : false}
      </Switch>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={Boolean(props.snackbar.message)}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MySnackbarContentWrapper
          onClose={handleClose}
          variant={props.snackbar.type}
          message={props.snackbar.message}
        />
      </Snackbar>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    login: state.Usuarios.login,
    userData: state.Usuarios.userById,
    snackbar: state.Usuarios.snackbar
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (user, pass) => { return actions.handleLogin(user, pass)(dispatch) },
    getTips: () => { return actions.getTips()(dispatch) },
    getAlerts: () => { return actions.getAlerts()(dispatch) },
    getById: (id) => { return actions.getInfoUser(id, "USERS/GET_DATA_BY_ID")(dispatch) },
    showSnackbar: (message, type) => { dispatch(actions.showSnackbar(message, type)) },
    newAlert: (data) => { newAlert(data)(dispatch) }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
