import React, { Component } from 'react'
import "./cofig.css";
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import * as actions from "../actions";
class Configuration extends Component {
    state = {
        name: "", lastname: "", age: "", genre: "", state: "", town: "", cel: "", password: "", email: "", address: "", occupation: ""
        , contact1Name: "", contact1Parentesco: "", contact1Email: "", contact2Name: "", contact2Parentesco: "", contact2Email: "", contact3Name: "", contact3Parentesco: "", contact3Email: ""
    }

    componentDidMount() {
        const { userData } = this.props;
        if (userData) {
            this.setState({ name: userData.nombres, lastname: userData.apellidos, age: userData.edad, genre: userData.genero, state: userData.estado, town: userData.municipio, cel: userData.celular, password: userData.password, email: userData.email, address: userData.colonia, occupation: userData.ocupacion });
            this.props.getContact(userData.id).then((res) => {
                res.map((item, key) => this.setState({ [`contact${key + 1}Name`]: item.nombre, [`contact${key + 1}Parentesco`]: item.parentesco, [`contact${key + 1}Email`]: item.correo }))
            })
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userData !== this.props.userData) {
            const { userData } = nextProps;
            this.setState({ name: userData.nombres, lastname: userData.apellidos, age: userData.edad, genre: userData.genero, state: userData.estado, town: userData.municipio, cel: userData.celular, password: userData.password, email: userData.email, address: userData.colonia, occupation: userData.ocupacion });
            this.props.getContact(userData.id).then((res) => {
                res.map((item, key) => this.setState({ [`contact${key + 1}Name`]: item.nombre, [`contact${key + 1}Parentesco`]: item.parentesco, [`contact${key + 1}Email`]: item.correo }))
            })
        }
    }
    onSaveMyData = async () => {
        const { name, lastname, age, genre, state, town, cel, password, email, address, occupation } = this.state;
        if (name === "" && lastname === "" && age === "" && genre === "" && state === "" && town === "" && cel === "" && password === "" && email === "" && address === "" && occupation === "") {
            this.props.showSnackbar("Los campos no deben ir vacios", "error");
            return;
        }
        await this.props.handleUpdateUser(this.props.login.usuario.id, name, lastname, age, genre, state, town, cel, password, email, address, occupation);
        this.props.showSnackbar("La información se ha guardado sastifactoriamente!.", "success")

    }
    onSaveContact = () => {
        const { contact1Parentesco, contact2Parentesco, contact3Parentesco, contact1Name, contact2Name, contact3Name, contact1Email, contact2Email, contact3Email } = this.state;
        if (contact1Name !== "" && contact1Parentesco !== "" && contact1Email !== "" && !this.props.contacts[0]) {
            this.props.saveContact(this.props.userData.id, contact1Name, contact1Email, contact1Parentesco);
        }
        if (contact2Name !== "" && contact2Parentesco !== "" && contact2Email !== "" && !this.props.contacts[1]) {
            this.props.saveContact(this.props.userData.id, contact2Name, contact2Email, contact2Parentesco);
        }
        if (contact3Name !== "" && contact3Parentesco !== "" && contact3Email !== "" && !this.props.contacts[2]) {
            this.props.contacts[2].nombre = contact3Name;
            this.props.saveContact(this.props.userData.id, contact3Name, contact3Email, contact3Parentesco);
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.id || e.target.name]: e.target.value });
    }
    render() {
        const { name, lastname, age, genre, state, town, cel, password, email, address, occupation,
            contact1Parentesco, contact2Parentesco, contact3Parentesco, contact1Name, contact2Name, contact3Name, contact1Email, contact2Email, contact3Email } = this.state;
        let disableTxt1 = false, disableTxt2 = false, disableTxt3 = false;
        if (this.props.contacts) {
            disableTxt1 = this.props.contacts.find((item) => { return item.nombre === contact1Name });
            disableTxt2 = this.props.contacts.find((item) => { return item.nombre === contact2Name });
            disableTxt3 = this.props.contacts.find((item) => { return item.nombre === contact3Name });
        }
        return (
            <div className="reports-home-container">
                <div className="title-new-report flex-center">
                    Configuración
<div>Completa tu perfil y escoge tus contactos de confianza.</div>
                </div>
                <div className="edit-profile-container">
                    <div className="profile-container" style={{ marginTop: "5%" }}>
                        <div className="bar-title"><div className="title-bar">Editar perfil</div></div>
                        <div className="form-conf ">
                            <TextField
                                id="name"
                                label="Nombre(s)"
                                value={name}
                                onChange={this.handleChange}
                                className="ta-conf"
                                margin="normal"
                            />
                            <TextField
                                id="lastname"
                                label="Apellido(s)"
                                value={lastname}
                                onChange={this.handleChange}
                                className="ta-conf"
                                margin="normal"
                            />
                            <TextField
                                id="email"
                                label="Correo electronico"
                                value={email}
                                onChange={this.handleChange}
                                className="ta-conf"
                                margin="normal"
                            />
                            <TextField
                                id="password"
                                label="Contraseña"
                                value={password}
                                onChange={this.handleChange}
                                className="ta-conf"
                                margin="normal"
                                type="password"
                            />
                            <TextField
                                id="state"
                                label="Estado"
                                value={state}
                                onChange={this.handleChange}
                                className="ta-genre"
                                margin="normal"
                            />
                            <TextField
                                id="town"
                                label="Municipio"
                                value={town}
                                onChange={this.handleChange}
                                className="ta-genre"
                                margin="normal"
                            />
                            <TextField
                                id="address"
                                label="Colonia"
                                value={address}
                                onChange={this.handleChange}
                                className="ta-genre"
                                margin="normal"
                            />
                            <TextField
                                id="occupation"
                                label="Ocupación"
                                value={occupation}
                                onChange={this.handleChange}
                                style={{ width: "32%" }}
                                margin="normal"
                            />
                            <TextField
                                id="cel"
                                label="Celular"
                                value={cel}
                                onChange={this.handleChange}
                                style={{ width: "29%" }}

                                margin="normal"
                            />
                            <TextField
                                id="age"
                                label="Edad"
                                value={age}
                                onChange={this.handleChange}
                                style={{ width: "11%" }}
                                margin="normal"
                            />
                            <TextField
                                id="genre"
                                label="Genero"
                                value={genre}
                                onChange={this.handleChange}
                                style={{ width: "20%" }}
                                margin="normal"
                            />
                        </div>
                        <div className="container-button">
                            <button className="btn-blue " onClick={this.onSaveMyData}>Guardar información</button>
                        </div>
                    </div>
                    <div className="profile-container" style={{ marginTop: "5%" }}>
                        <div className="bar-title"><div className="title-bar">Mis contactos</div></div>
                        <div className="form-conf">
                            <TextField
                                id="contact1Name"
                                label="Nombre"
                                value={contact1Name}
                                onChange={this.handleChange}
                                disabled={Boolean(disableTxt1)}
                                style={{ width: "40%" }} margin="normal"
                            />
                            <TextField
                                id="contact1Parentesco"
                                label="Parentesco"
                                value={contact1Parentesco}
                                disabled={Boolean(disableTxt1)}
                                onChange={this.handleChange}
                                style={{ width: "20%" }}
                                margin="normal"
                            />
                            <TextField
                                id="contact1Email"
                                label="Correo electronico"
                                value={contact1Email}
                                disabled={Boolean(disableTxt1)}
                                onChange={this.handleChange}
                                style={{ width: "30%" }}
                                margin="normal"
                            />
                            <TextField
                                id="contact2Name"
                                label="Nombre"
                                value={contact2Name}
                                disabled={Boolean(disableTxt2)}
                                onChange={this.handleChange}
                                style={{ width: "40%" }} margin="normal"
                            />
                            <TextField
                                id="contact2Parentesco"
                                label="Parentesco"
                                value={contact2Parentesco}
                                disabled={Boolean(disableTxt2)}
                                onChange={this.handleChange}
                                style={{ width: "20%" }}
                                margin="normal"
                            />
                            <TextField
                                id="contact2Email"
                                label="Correo electronico"
                                disabled={Boolean(disableTxt2)}
                                value={contact2Email}
                                onChange={this.handleChange}
                                style={{ width: "30%" }}
                                margin="normal"
                            />
                            <TextField
                                id="contact3Name"
                                label="Nombre"
                                disabled={Boolean(disableTxt3)}
                                value={contact3Name}
                                onChange={this.handleChange}
                                style={{ width: "40%" }} margin="normal"
                            />
                            <TextField
                                id="contact3Parentesco"
                                label="Parentesco"
                                value={contact3Parentesco}
                                disabled={Boolean(disableTxt3)}
                                onChange={this.handleChange}
                                style={{ width: "20%" }}
                                margin="normal"
                            />
                            <TextField
                                id="contact3Email"
                                label="Correo electronico"
                                value={contact3Email}
                                disabled={Boolean(disableTxt3)}
                                onChange={this.handleChange}
                                style={{ width: "30%" }}
                                margin="normal"
                            />
                        </div>
                        <div className="container-button">
                            <button className="btn-blue " onClick={this.onSaveContact}>Guardar contactos</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        login: state.Usuarios.login,
        userData: state.Usuarios.userById,
        snackbar: state.Usuarios.snackbar,
        updateUser: state.Usuarios.updateUser,
        contacts: state.Usuarios.getContacts
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showSnackbar: (message, type) => { dispatch(actions.showSnackbar(message, type)) },
        handleUpdateUser: (id, nombres, apellidos, edad, genero, estado, municipio, celular, password, email, colonia, ocupacion) => { return actions.updateUser(id, nombres, apellidos, edad, genero, estado, municipio, celular, password, email, colonia, ocupacion)(dispatch) },
        getContact: (id) => { return actions.getContacts(id)(dispatch) },
        saveContact: (id, nombre, correo, parentesco) => { return actions.saveContact(id, nombre, correo, parentesco)(dispatch) }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
