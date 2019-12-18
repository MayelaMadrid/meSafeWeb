import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import "./reportes.css"
import Mp from '@material-ui/icons/Map';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';
import Dropzone from '../../../components/dropzone';
import { IconButton, CircularProgress } from '@material-ui/core';
import Map from '../../../components/googleMap/newMap';
import { connect } from 'react-redux';
import * as actions from "../../reports/actions";
import { Marker } from 'react-google-maps';
import * as users from "../../usuarios/actions"
import Geocode from "react-geocode";
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import firebase from 'firebase';

Geocode.setApiKey("AIzaSyDCTc_IuiXgVT8RmAAmyaOW4s3v3_22nlk");
Geocode.enableDebug();



class CrearReporte extends Component {
    state = {
        date: "",
        type: false,
        description: "",
        files: [],
        location: "",
        visibleMap: false,
        markers: false,
        time: "",
        mylocation: { lat: 24.8042, lng: -107.431 },
        loading: false
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => this.setState({ mylocation: { lat: position.coords.latitude, lng: position.coords.longitude } }));
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.id || e.target.name]: e.target.value });
    }
    onClick = (t, map, coord) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();

        this.setState({
            markers: {
                title: "",
                name: "",
                position: { lat, lng }
            }
        });
    }
    onMarkerDragEnd = (coord) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        Geocode.fromLatLng(lat, lng).then(
            response => {
                const address = response.results[0].formatted_address;
                this.setState({ mylocation: { lat, lng }, location: address })
            });
    }

    onSaveReport = async () => {
        const { type, description, date, location, files, time, mylocation } = this.state;
        let imageRef = []
        this.setState({ loading: true })

        const array = files.map(async (item, key) => {
            var storageRef = firebase.storage().ref().child(`reportes${key}${Date.now()}.png`);

            await storageRef.putString(item, 'base64').then(function (snapshot) {
                return snapshot.task.uploadUrl_
            });
            return await storageRef.getDownloadURL().then(function (url) {
                imageRef.push(url)
                return url
            });

        })
        const images = await Promise.all(array);

        if (type === "" && description === "" && date === "" && location === "" && time === "" && files.length === 0) {
            this.props.showSnackbar("Los campos no deben ir vacios", "error")
            return
        }
        let newDate = moment(date + " " + time).format();
        this.props.onSaveReport(this.props.userById.id, description,
            newDate,
            location,
            0,
            0,
            type,
            mylocation.lat,
            mylocation.lng,
            0,
            imageRef).then((res) => {
                if (res && res.id_usuario) {
                    this.setState({ loading: false });
                    this.props.showSnackbar("El reporte se ha creado sastifactoriamente!.", "success")
                    this.props.history.push("/");
                } else {
                    this.props.showSnackbar("Ha ocurrido un error al guardar el reporte!.", "error")
                }
            })
    }

    render() {

        const { type, description, date, location, visibleMap, time, mylocation, loading } = this.state;
        return (
            <div className="reports-home-container">
                <div className="title-new-report flex-center">
                    Inicia tu reporte
 <div>Recuerda que con ayuda de tu reporte mantenemos esta ciudad segura.</div>
                </div>
                <div className="container-form-new">
                    <Dropzone onFilesAdded={(e) => this.setState({ files: e })} />
                    <div className="container-ipt">
                        <TextField
                            id="description"
                            label="Descripción"
                            multiline
                            rows="2"
                            value={description}
                            onChange={this.handleChange}
                            className="ta-description"
                            margin="normal"
                        />

                        <div className="cont-ipts-short">
                            <div className="ipt-type">
                                <InputLabel id="demo-simple-select-label">Tipo de situacion</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="type"
                                    name="type"
                                    value={type}
                                    className="tipo-ipt"
                                    onChange={this.handleChange}
                                >
                                    <MenuItem id="type" value={"5dedecb8406b030ee5d9c041"}>Asalto</MenuItem>
                                    <MenuItem id="type" value={"5dedecb8406b030ee5d9c042"}>Robo</MenuItem>
                                    <MenuItem id="type" value={"5dedecb8406b030ee5d9c043"}>Tiroteo</MenuItem>
                                    <MenuItem id="type" value={"5dedecb8406b030ee5d9c044"}>Acoso</MenuItem>
                                    <MenuItem id="type" value={"5deeccd1c19d9931909c53fa"}>Emergencia</MenuItem>
                                    <MenuItem id="type" value={"5deecd51c19d9931909c53fb"}>Precaución</MenuItem>
                                </Select>
                            </div>
                            <TextField
                                id="date"
                                label="Fecha"
                                type="date"
                                className="ipt-date"
                                value={date}
                                onChange={this.handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                id="time"

                                label="Hora"
                                type="time"
                                className="ipt-date"
                                value={time}
                                onChange={this.handleChange}
                                InputLabelProps={{
                                    shrink: true,

                                }}
                            />
                        </div>

                        <div className="ipt-location">
                            <TextField
                                id="location"
                                label="Ubicación"
                                multiline
                                rows="1"
                                rowsMax="3"
                                value={location}
                                onChange={this.handleChange}
                                className="ta-location"
                                margin="normal"
                            />
                            <IconButton onClick={() => { this.setState({ visibleMap: true }) }} title="Seleccion del mapa"><Mp style={{ color: "var(--color-blue-general)" }}></Mp></IconButton>
                        </div>

                    </div>

                    {visibleMap && <div className="modal-map">
                        <IconButton className="close-modal" onClick={() => { this.setState({ visibleMap: false }) }} title="Cerrar mapa"><Close style={{ fontSize: "2rem", color: "white" }} /></IconButton>
                        <Map
                            google={this.props.google}
                            defaultCenter={{ lat: mylocation.lat, lng: mylocation.lng }}
                            center={{ lat: mylocation.lat, lng: mylocation.lng }}
                            height='300px'
                            zoom={15}
                            onChange={(lat, lng) => { this.setState({ mylocation: { lat, lng } }) }}
                            onChangeText={(text) => { this.setState({ location: text }) }}

                        >
                            <Marker
                                google={this.props.google}
                                name={'Reporte'}
                                draggable={true}
                                onDragEnd={this.onMarkerDragEnd}
                                position={{ lat: mylocation.lat, lng: mylocation.lng }}
                            />
                        </Map>
                        <IconButton style={{ fontSize: "1.5rem", color: "white" }} className="save-modal" onClick={() => { this.setState({ visibleMap: false }) }} title="Guardar ubicación"><Done style={{ fontSize: "2rem" }} /> </IconButton>
                    </div>}
                    <div className="btns-save-report">
                        <Link to="/"> <button className="btn-blue btn-cancel">Cancelar</button></Link>
                        <button className="btn-blue " onClick={this.onSaveReport}>Compartir reporte</button>
                    </div>
                </div>
                {loading &&
                    <div className="loading-modal flex-center">
                        <CircularProgress></CircularProgress>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reports: state.Reports.reports,
        userById: state.Usuarios.userById

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
            return actions.saveReports(
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
        showSnackbar: (message, type) => { dispatch(users.showSnackbar(message, type)) }

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CrearReporte);
