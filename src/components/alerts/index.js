import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import Warning from "../../images/warning.svg";
import Geocode from "react-geocode";
import * as moment from 'moment';
import * as actions from "../../modules/usuarios/actions";
import 'moment/locale/es';
import { getDistance } from '../../utils';
import Avatar from "@material-ui/core/Avatar";
moment.locale('es');
Geocode.setApiKey("AIzaSyDCTc_IuiXgVT8RmAAmyaOW4s3v3_22nlk");
Geocode.enableDebug();

const ReturnAlert = ({ value, getDataUser }) => {
    const [location, setLocation] = useState(false);
    const [myLocation, setMyLocation] = useState("");
    const [infoUser, setInfoUser] = useState(undefined);
    let distancia = "";
    const getLocation = async (lng, lat) => {
        Geocode.fromLatLng(parseFloat(lat), parseFloat(lng)).then(
            response => {
                setLocation(response.results[0].formatted_address.split(",").slice(0, 2));
            }).catch(err => { return "" })
    }
    if (!infoUser) {
        getDataUser(value.id_usuario).then((res) => { setInfoUser(res) });
    }
    if (!location) getLocation(parseFloat(value.longitud), parseFloat(value.latitud));
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude }));
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
    if (myLocation !== "") {
        distancia = getDistance(myLocation, { lng: value.longitud, lat: value.latitud })

    }
    return (<div className="alert">
        <Avatar className="avatarAlert">{infoUser && infoUser.nombres ? infoUser.nombres.substring(0, 2).toUpperCase() : ''}</Avatar>
        <div>
            <div>{infoUser && `${infoUser.nombres} ${infoUser.apellidos}`}</div>
            <div title={`${location ? location : ""}`}>{`${moment(value.fecha).format('L, h:mm a')} `} </div>
            <div> {`${location ? location : ""}`}</div>
            <div> {isNaN(distancia) ? "" : `Distancia: ${parseFloat(distancia).toFixed(2)} mts`}</div>
            <div></div>
        </div>
    </div >)

}

const Alerts = (props) => {
    const [tip, setTip] = useState(0);
    const { alerts, tips } = props;

    useEffect(() => {

        const interval = setInterval(() => {
            if (tips && tips.length === tip + 1) {
                setTip(0);
                return
            }
            if (tips) {
                setTip(tip + 1);
            }
        }, 4000);

        return () => clearInterval(interval);
    });
    return (
        <div className="alerts-home-container">
            <div className="alerts">
                <div className="title-alerts flex-center">Alertas</div>
                {alerts &&
                    alerts.map((item, key) => {
                        return <ReturnAlert key={key} value={item} getDataUser={props.getDataUser} />
                    })}
            </div>
            <div className="tips">
                <div className="title-tip flex-center">Tips que te protegen</div>
                <div className="tip flex-center">

                    {tips && <div>{tips[tip].consejo}</div>}
                    <img alt="" style={{ width: "32%" }} src={Warning}></img>

                </div>
            </div>
        </div >
    )
}
const mapStateToProps = (state) => {
    return {
        tips: state.Usuarios.tips,
        alerts: state.Usuarios.alerts
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        getDataUser: (id) => { return actions.getInfoUser(id, "USERS/GET_DATA_BY_ID_OTHER")(dispatch) },
        getTips: () => { return actions.getTips()(dispatch) },
        getAlerts: () => { return actions.getAlerts()(dispatch) },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
