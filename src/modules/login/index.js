import React, { Component } from 'react';
import SignUp from './SignUp';
import Login from './login/login';
import { handleLogin, handleSignUp, getTips, getAlerts, getInfoUser } from "../usuarios/actions";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';

class LoginContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            signUp: false,
            userLogin: "",
            passLogin: "",
            nameSU: "",
            lnSU: "",
            email: "",
            passSU: "",
            confirmPass: "",
            keepActive: false,
            error: false,
            message: false,
            disable: false

        }
    }


    componentDidMount() {
        localStorage.clear();
        sessionStorage.clear();

    }
    changeShowingScreen = () => {
        this.setState({ signUp: !this.state.signUp });
    };
    signUp = () => {
        this.setState({ disable: true })
        const { nameSU, lnSU, email, passSU } = this.state;
        this.props.handleSignup({ nombres: nameSU, apellidos: lnSU, email: email, password: passSU }).then(() => {
            this.setState({ message: " El usuario se ha registrado sastifactoriamente ", disable: false });
        }).catch(() => {
            this.setState({ message: " Ha ocurrido un error, intente de nuevo o más tarde", disable: false });
        })
        this.changeShowingScreen()
    }

    changeShowingScreen = () => {
        this.setState({ signUp: !this.state.signUp });
    };
    handleClose = () => {
        this.setState({ message: false })
    }
    handleChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }
    handleLogin = () => {
        this.setState({ disable: true })
        const { userLogin, passLogin, keepActive } = this.state;
        this.props.handleLogin(userLogin, passLogin).then(() => {
            if (this.props.login && this.props.login.usuario) {
                if (keepActive) {
                    localStorage.setItem("username", userLogin);
                    localStorage.setItem("password", passLogin);
                    localStorage.setItem("token", this.props.login.token);

                }
                sessionStorage.setItem("username", userLogin);
                sessionStorage.setItem("password", passLogin);
                sessionStorage.setItem("token", this.props.login.token);
                this.props.getTips();
                this.props.getAlerts();
                this.props.getById(this.props.login.usuario.id);
                this.props.history.push("/");
            }
        }).catch(() => {
            this.setState({ error: true, disable: false })
            setTimeout(() => {
                this.setState({ error: false })
            }, 2500);
        })


    }
    visibleScreen = (origin) => {
        let response;
        if (!this.state.signUp) {
            if (origin) {
                response = 'left-img-side';
            }
        } else {
            if (origin) {
                response = 'right-img-side';
            }
        }
        return response;
    };
    keepActive = (e) => {
        this.setState({ keepActive: !this.state.keepActive });
    }

    render() {
        if (localStorage.getItem("username") && localStorage.getItem("password")) {
            return <Redirect to='/' />;
        }
        if (sessionStorage.getItem("username") && sessionStorage.getItem("password")) {
            return <Redirect to='/' />;
        }
        return (
            <div className="container flex-center">
                <div className="login-card">
                    <div className={`login-side ${this.visibleScreen('img-side')}`}>
                    </div>
                    <Login disableButton={this.state.disable} error={this.state.error} onChangeInput={this.handleChange} onChange={this.changeShowingScreen} onClickLogin={this.handleLogin} keepActive={this.keepActive}></Login>
                    <SignUp disableButton={this.state.disable} onChangeInput={this.handleChange} onChange={this.changeShowingScreen} onClick={this.signUp}></SignUp>
                </div>
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    key={"vertical horizontal"}
                    open={this.state.message}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.message}</span>}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.Usuarios.login
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleLogin: (userLogin, passLogin) => { return handleLogin(userLogin, passLogin)(dispatch) },
        getTips: () => { return getTips()(dispatch) },
        getAlerts: () => { return getAlerts()(dispatch) },
        handleSignup: (signUp) => { return handleSignUp(signUp)(dispatch) },
        getById: (id) => { return getInfoUser(id, "USERS/GET_DATA_BY_ID")(dispatch) },

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);

