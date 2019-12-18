import React from 'react';
import './login.css';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Email, Password } from '../../../components/IconLogin';
import GoogleLogin from 'react-google-login';
const Login = (props) => {

  const responseGoogle = (response) => {
    console.log(response);
  }

  return (
    <div className="login-side form-side">
      <div className="logo-login flex-center">
        <img src={require("../../../images/meSafe-final-logo.png")} alt="meSafe"></img>
      </div>
      <div className="form-login">

        <TextField
          className=""
          id="userLogin"
          onChange={props.onChangeInput}
          label="Correo Electronico"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <Email></Email>
              </InputAdornment>
            ),
          }}
        />
        {props.error && <label className="label-error">El usuario o contraseña son incorrectos</label>}
        <TextField
          className=""
          id="passLogin"
          onChange={props.onChangeInput}
          label="Contraseña"
          type="password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <Password></Password>
              </InputAdornment>
            ),
          }}
        />
        <button id="prueba" disabled={props.disableButton} className="btn-blue btn-login" onClick={props.onClickLogin}>Iniciar sesión</button>
      </div>
      <div className="methods-login">
        <GoogleLogin
          clientId="581576628435-le19d1sj1gvvau0uhbfg58gseqednb0e.apps.googleusercontent.com"
          buttonText=""
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      </div>
      <div className="label-login">
        <label className="cursor">
          <Checkbox
            onChange={props.keepActive}
            value="checkedA"
            inputProps={{
              'aria-label': 'primary checkbox',
            }}
          />Mantener sesión iniciada</label>
        <label className="cursor">Olvide mi contraseña</label>
        <label className="underline cursor" onClick={props.onChange}>¿No tienes cuenta? Registrate aquí </label>
      </div>
    </div>
  );
}


export default Login;