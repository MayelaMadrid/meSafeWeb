import React, { useState } from 'react';
import "./report.css";
import Geocode from "react-geocode";
import * as moment from 'moment';
import 'moment/locale/es';
import Delete from '@material-ui/icons/Delete';
import { findColorByType } from '../../utils';
import Avatar from "@material-ui/core/Avatar";
import { IconButton } from "@material-ui/core";
moment.locale('es');
Geocode.setApiKey("AIzaSyDCTc_IuiXgVT8RmAAmyaOW4s3v3_22nlk");
Geocode.enableDebug();
export const ReportUser = ({ value, onClick, deleteReport, onDeleteReport }) => {
    const [location, setLocation] = useState(undefined);
    const getLocation = async (lng, lat) => {
        Geocode.fromLatLng(lat, lng).then(
            response => {
                setLocation(response.results[0].formatted_address);
            }).catch(err => { return "" })
    }
    getLocation(value.longitud, value.latitud);
    return (
        <div className="report-user" onClick={onClick}>
            {deleteReport && <IconButton onClick={() => onDeleteReport(value.id)} className="delete-report" title="Eliminar reporte"><Delete /></IconButton>}
            <div className="report-info">
                <Avatar className="reportAvatar">{value.usuario && value.usuario.nombres ? value.usuario.nombres.substring(0, 2).toUpperCase() : ''}</Avatar>
                <div className="report-name">{`${value.usuario.nombres} ${value.usuario.apellidos}`}</div>

                <div className="qlfctn-report">
                    <img src={require("../../images/like.svg")} alt="Confio en el reporte" />{value.postivos}
                </div>
                <div className="qlfctn-report">
                    <img style={{ marginTop: "17%" }} src={require("../../images/nolike.svg")} alt="No confio en el reporte" /> {value.negativos}
                </div>

            </div>
            {value.imagenes.length > 0 && <div className="images-report">
                {value.imagenes && value.imagenes.map((item) => {
                    return <img src={item.imagen} alt="" />
                })}
            </div>}
            <p> {value.descripcion}</p >
            <div className="date-place-report">{`${moment(value.fecha).format('LLLL')} | ${location ? location : ""}`} <div className="type-report bold">{findColorByType(value.tipo_reporte)}</div></div>
        </div>

    )
};