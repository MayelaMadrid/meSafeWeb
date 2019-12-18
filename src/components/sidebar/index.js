import React, { useState } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import { saveReports } from "../../modules/reports/actions";
import { getContacts } from "../../modules/usuarios/actions";
import Avatar from "@material-ui/core/Avatar";
import './sidebar.css';

import 'moment/locale/es';
const Sidebar = (props) => {
    const userById = props.login ? props.login.usuario : props.userById;
    const [options, setOptions] = useState(false);
    const [myLocation, setMyLocation] = useState("");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude }));
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
    let buttonPressTimer;
    const sendFeedback = (templateId, variables) => {
        window.emailjs.send(
            'gmail', templateId,
            variables
        ).then(res => {
            console.log('Email successfully sent!')
        })
            .catch(err => console.error('Oh well, you failed. Here some thoughts on the error that occured:', err))
    }
    const handleButtonPress = () => {
        buttonPressTimer = setTimeout(() => {
            props.connection.invoke("newEmergencyReport", {
                id_usuario: userById.id, fecha: moment().format(), latitud: myLocation.lat,
                longitud: myLocation.lng
            });
            const templateId = 'template_SIJ17fyN';
            props.getContact(userById.id).then((res) => {
                res.map((item) => {
                    sendFeedback(templateId, {
                        message_html: `El usuario ${userById.nombres} ${userById.apellidos} acaba de activar el botón de panico mediante web. Esta es su localización https://www.google.com.mx/maps/place/${myLocation.lat},${myLocation.lng}`,
                        from_name: "MeSafe", reply_to: item.correo
                    })
                    return false;
                })
            })

            props.onSaveReport(userById.id, "", moment().format(), "", 0, 0, "5deeccd1c19d9931909c53fa", myLocation.lat, myLocation.lng, true, []);
        }, 1500);
    }

    const handleButtonRelease = () => {
        clearTimeout(buttonPressTimer);
    }


    return (
        <div className="sidebar-container">
            <div className="logo-sidebar flex-center">
                <label>meSafe</label>
            </div>
            <div className="info-user-home"
                onTouchStart={() => handleButtonPress()}
                onTouchEnd={() => handleButtonRelease()}
                onMouseDown={() => handleButtonPress()}
                onMouseUp={() => handleButtonRelease()}
                onMouseLeave={() => handleButtonRelease()}>
                <Avatar className="userAvatar">{userById && userById.nombres ? userById.nombres.substring(0, 2).toUpperCase() : ''}</Avatar>
                <div className="user-name">{userById && `${userById.nombres} ${userById.apellidos}`}</div>
                <div>{userById && `${userById.ocupacion} | ${userById.colonia}`}</div>
            </div>
            <div className="sidebar-menu">
                <h3>Menú</h3>
                <ul>
                    <li className="menu-item"><Link to="/">Home</Link></li>
                    <li className="menu-item"><Link to="/misReportes">Mis reportes</Link></li>
                    {(props.login && props.login.rol !== "5dede7d9406b030ee5d9c03f") || (props.userById && props.userById.id_rol !== "5dede7d9406b030ee5d9c03f") ? <li className="menu-item" onClick={() => setOptions(!options)}>Estadisticas
                        {options &&
                            <ul>
                                <li className="menu-item subitem"><Link to="/estadisticas/barras">Barras</Link></li>
                                <li className="menu-item subitem"><Link to="/estadisticas/lineal">Lineal</Link></li>
                            </ul >
                        }
                    </li> : false}
                    {(props.login && props.login.rol !== "5dede7d9406b030ee5d9c03f") || (props.userById && props.userById.id_rol !== "5dede7d9406b030ee5d9c03f") ? <li className="menu-item"><Link to="/revision"> Revisión</Link></li> : false}
                    <li className="menu-item"><Link to="/mapa"> Mapa</Link></li>
                    <li className="menu-item"><Link to="/numerosTelefonicos">  Números de emergencia</Link></li>
                    <li className="menu-item"><Link to="/configuracion"> Configuración</Link></li>
                    <li className="menu-item"><Link to="/login" onClick={() => { sessionStorage.clear(); localStorage.clear(); }}>  Cerrar sesión</Link></li>
                </ul>

            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        userById: state.Usuarios.userById,
        login: state.Usuarios.login

    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSaveReport: (
            id_usuario, description,
            fecha,
            ubicacion,
            postivos,
            negativos,
            tipo_reporte,
            latitud,
            longitud,
            emergencia,
            imagenes) => {
            return saveReports(
                id_usuario, description,
                fecha,
                ubicacion,
                postivos,
                negativos,
                tipo_reporte,
                latitud,
                longitud,
                emergencia,
                imagenes)(dispatch)
        },
        getContact: (id) => { return getContacts(id)(dispatch) },

    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
