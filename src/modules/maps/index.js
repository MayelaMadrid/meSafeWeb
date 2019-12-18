import React, { Component } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CalendarToday from '@material-ui/icons/CalendarToday';
import AccessTime from '@material-ui/icons/AccessTime';
import Warning from '@material-ui/icons/Report';
import Map from '../../components/googleMap/newMap';
import { Circle } from 'react-google-maps';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Geocode from "react-geocode";
import "./map.css";
import { connect } from 'react-redux';
import * as moment from 'moment';
import * as actions from "../reports/actions";
import { CircularProgress } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { findColorByType } from '../../utils';
Geocode.setApiKey("AIzaSyDCTc_IuiXgVT8RmAAmyaOW4s3v3_22nlk");
Geocode.enableDebug();
class MapReports extends Component {
  state = {
    date: "",
    time: "",
    type: "",
    loading: false,
  };
  handleChange = (e) => {
    this.setState({ [e.target.id || e.target.name]: e.target.value });
  }
  componentDidMount() {
    if (this.props.reports) {
      return;
    }
    this.setState({ loading: true })
    this.props.getReports().then((res) => this.setState({ loading: false, reports: res }))
  }


  filterReports = () => {
    const { date, time, type } = this.state;
    let newReports = this.props.reports;
    if (type !== "") {
      newReports = newReports.filter((item) => item.tipo_reporte === type)
    }
    if (type !== "") {
      newReports = newReports.filter((item) => item.tipo_reporte === type)
    }
    if (time !== "") {
      newReports = newReports.filter((item) => {
        let newTime = time.toString().charAt(0) === "0" ? time.slice(1) : time
        return moment(item.fecha).format('LT') === newTime
      })
    }
    if (date !== "") {
      newReports = newReports.filter((item) => moment(item.fecha).format('L') === date.split("-").reverse().join("/"))
    }
    this.setState({ reports: newReports });
  }
  render() {
    const { time, date, type, loading, reports } = this.state;
    const colors =
    {
      Asalto: {
        strokeColor: "orange",
        fillColor: "orange"
      },
      Tiroteo: {
        strokeColor: "blue",
        fillColor: "blue"

      }, Acosos: {
        strokeColor: "green",
        fillColor: "green"
      }, Robos: {
        strokeColor: "yellow",
        fillColor: "yellow"
      }, Secuestros: {
        strokeColor: "red",
        fillColor: "red"
      },
      Precaucion: {
        strokeColor: "gray",
        fillColor: "gray"
      },
      Acoso: {
        strokeColor: "green",
        fillColor: "green"
      }
    };
    return (
      <div className="reports-home-container">
        <div className="title-new-report flex-center">
          Atlas de riesgo
 <div>Localiza las zonas menos segura</div>
        </div>
        <div className="filter-container">
          <TextField
            id="date"
            label="Fecha"
            type="date"
            className="ipt-date"
            value={date}
            onChange={this.handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday style={{ color: "var(--color-blue-general)" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="time"
            label="Hora"
            type="time"
            className="ipt-date"
            value={time}
            false
            onChange={this.handleChange}

            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTime style={{ color: "var(--color-blue-general)" }} />
                </InputAdornment>
              ),
            }}
          />
          <div className="icon-text">
            <Warning style={{ color: "var(--color-blue-general)", position: "absolute", top: "29%" }} />
            <InputLabel id="demo-simple-select-label">Tipo de situacion</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="type"
              name="type"
              className="pd-10"
              value={type}
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
          <button className="btn-blue" onClick={this.filterReports}>Filtrar</button>
          <div className="colors-type">
            <div><div style={{ background: "orange" }} className="span-type" />Asalto</div>
            <div><div style={{ background: "yellow" }} className="span-type" />Robo</div>
            <div><div style={{ background: "blue" }} className="span-type" />Tiroteo</div>
            <div><div style={{ background: "gray" }} className="span-type" />Precaucion</div>
            <div><div style={{ background: "green" }} className="span-type" />Acoso</div>

          </div>
        </div>
        <Map
          google={this.props.google}
          center={{ lat: 24.7903194, lng: -107.3878174 }}
          height='300px'
          zoom={12}>
          {
            reports && reports.map((item, key) => {
              return <Circle key={key} defaultCenter={{
                lat: parseFloat(item.latitud),
                lng: parseFloat(item.longitud)
              }}
                radius={50}
                options={colors[findColorByType(item.tipo_reporte)]}></Circle>

            })
          }

        </Map>
        {loading &&
          <div className="loading-modal flex-center">
            <CircularProgress></CircularProgress>
          </div>
        }
      </div>
    )
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
    getReports: () => { return actions.getReports()(dispatch) }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MapReports);
