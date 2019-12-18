import React, { Component } from 'react'
import Left from '@material-ui/icons/KeyboardArrowLeft';
import Rigth from '@material-ui/icons/KeyboardArrowRight';
import Visibility from '@material-ui/icons/Visibility';
import { connect } from 'react-redux';
import * as moment from 'moment';
import * as actions from "../actions";
import Geocode from "react-geocode";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Close from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { findColorByType } from '../../../utils';
import Avatar from "@material-ui/core/Avatar";
import "./detail.css"
moment.locale('es');
Geocode.setApiKey("AIzaSyDCTc_IuiXgVT8RmAAmyaOW4s3v3_22nlk");
Geocode.enableDebug();

class DetailReport extends Component {
    state = {
        location: false,
        negatives: this.props.detail.negativos,
        positives: this.props.detail.postivos,
        descensored: false,
        numberImage: 0,
        anchorEl: null,
        blockQualify: false
    }
    componentDidMount() {
        this.getLocation(this.props.detail.longitud, this.props.detail.latitud);
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    changeImage = (side) => {
        const length = this.props.detail.imagenes.length;
        if (length === 1) {
            return
        }
        if (side === "ahead") {
            if (this.state.numberImage + 1 === length) {
                this.setState({ numberImage: 0 });
            }
            if (this.state.numberImage + 1 !== length) {
                this.setState({ numberImage: this.state.numberImage + 1 });
            }
            return
        }
        if (this.state.numberImage - 1 < 0) {
            this.setState({ numberImage: length - 1 });
            return
        }
        this.setState({ numberImage: this.state.numberImage - 1 });
    }

    censoreReport = () => {
        this.props.censoreImage(this.props.detail.imagenes[this.state.numberImage].id, 0);
        this.handleClose();
    }

    qualifyReport = (rate) => {
        if (this.stateblockQualify) {
            return;
        }
        this.props.setQualify(this.props.detail.id, rate);
        if (rate === 1) {
            this.setState({ blockQualify: true, positives: this.state.positives + 1 })
            return;
        }
        this.setState({ blockQualify: true, negatives: this.state.negatives + 1 })
    }
    denounceImage = () => {
        this.props.denounceImage(this.props.detail.id);
    }

    getLocation = (lng, lat) => {
        Geocode.fromLatLng(lat, lng).then(
            response => {
                this.setState({ location: response.results[0].formatted_address });
            }).catch(err => { return "" })
    }
    render() {
        const { detail } = this.props;
        const { location, positives, negatives, numberImage, anchorEl } = this.state;
        return (
            <div className="modal-detail flex-center">
                <IconButton className="close-modal" onClick={() => { this.props.getReports(); this.props.location.push("/") }} title="Cerrar mapa"><Close style={{ fontSize: "2rem", color: "white" }} /></IconButton>

                <div className={`detail-container ${!detail.imagenes.length ? 'no-img' : ''}`}>
                    {detail.imagenes.length > 0 && <div className="images-container">
                        <img src={detail.imagenes[numberImage].imagen} className={`${detail.imagenes[numberImage].reportes_censura > 9 && !this.state.descensored ? "censored" : ""} image-detail `} alt="" />
                        <Left onClick={() => this.changeImage("back")} className="arrow-left cursor"></Left>
                        <Rigth onClick={() => this.changeImage("ahead")} className="arrow-rigth cursor"></Rigth>
                        {detail.imagenes[numberImage].reportes_censura > 9 && !this.state.descensored && <IconButton onClick={() => this.setState({ descensored: true })} className="buttonVis"><Visibility />Ver imagenes censuradas</IconButton>}

                    </div>}
                    <div className="info-detail-user">
                        <Avatar className="reportAvatar">{detail.usuario && detail.usuario.nombres ? detail.usuario.nombres.substring(0, 2).toUpperCase() : ''}</Avatar>
                        <div className="report-name">{`${detail.usuario.nombres} ${detail.usuario.apellidos}`}</div>
                        <div>{findColorByType(detail.tipo_reporte)}</div>
                    </div>
                    <div className="description-detail">
                        {detail.descripcion}
                    </div>
                    <div className="detail-place-report">{`${moment(detail.fecha).format('LLLL')} | ${location ? location : ""}`} </div>

                    <div className="extra-detail">
                        <div onClick={() => this.qualifyReport(1)} className="qlfctn-report cursor">
                            <img src={require("../../../images/like.svg")} alt="Confio en el reporte" />{positives}
                        </div>
                        <div onClick={() => this.qualifyReport(-1)} className="qlfctn-report cursor">
                            <img style={{ marginTop: "17%" }} src={require("../../../images/nolike.svg")} alt="No confio en el reporte" /> {negatives}
                        </div>
                        Algo mal con este reporte?<div aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick} className="cursor denunciar-lb">Denunciar</div>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={this.censoreReport}>Censurar imagen</MenuItem>
                            <MenuItem onClick={this.denounceImage}>El reporte es falso</MenuItem>
                        </Menu>
                    </div>


                </div>

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
        setQualify: (id, rate) => { return actions.qualifyReport(id, rate)(dispatch) },
        censoreImage: (id, usuario) => { return actions.censoreReport(id, usuario)(dispatch) },
        denounceImage: (id) => { return actions.denounceReports(id)(dispatch) },
        getReports: () => { return actions.getReports()(dispatch) }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DetailReport);
