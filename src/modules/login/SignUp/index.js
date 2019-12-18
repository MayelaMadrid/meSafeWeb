import React from 'react';
import './signUp.css';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Email, Password, Lastname, User } from '../../../components/IconLogin';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

const SignUp = (props) => {
    const responseGoogle = (response) => {
        console.log(response);
    }
    const responseFacebook = (response) => {
        console.log(response);
    }
    return (
        <div className="login-side form-signup-side">
            <div className="title-signup">
                <span>Registro<span className="cursor" onClick={props.onChange}> / Login</span></span>
            </div>
            <div className="register-signup">
                <div className="form-signup">
                    <h1>Necesitaremos...</h1>
                    <TextField
                        className=""
                        id="nameSU"
                        label="Nombre(s) de usuario*"
                        onChange={props.onChangeInput}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <User></User>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        className=""
                        id="lnSU"
                        label="Apellido(s)*"
                        onChange={props.onChangeInput}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <Lastname></Lastname>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        className=""
                        id="email"
                        label="Correo electrónico*"
                        onChange={props.onChangeInput}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <Email></Email>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        className=""
                        id="passSU"
                        onChange={props.onChangeInput}
                        label="Contraseña*"
                        type="password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <Password></Password>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        className=""
                        id="confirmPass"
                        onChange={props.onChangeInput}
                        label="Confirma tu contraseña*"
                        type="password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <Password></Password>
                                </InputAdornment>
                            ),
                        }}
                    />

                </div>
                <div className="separator-vertical flex-center">
                    <span>ó</span>
                </div>
                <div className="methods-signup">
                    <GoogleLogin
                        clientId="581576628435-le19d1sj1gvvau0uhbfg58gseqednb0e.apps.googleusercontent.com"
                        buttonText="Registrarse con Google"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
            </div>

            <div className="button-signup flex-center">
                <button disabled={props.disableButton} className="btn-blue btn-signup " onClick={props.onClick}>Completar el registro</button>
            </div>
        </div>
    );
}
export default SignUp;