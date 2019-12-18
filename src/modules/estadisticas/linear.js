import React, { Component } from 'react'

import CalendarToday from '@material-ui/icons/CalendarToday';
import Warning from '@material-ui/icons/Report';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Geocode from "react-geocode";
import "./estadisticas.css";
import { connect } from 'react-redux';
import * as moment from 'moment';
import * as actions from "../reports/actions";
import { CircularProgress } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { VictoryChart, VictoryLine, VictoryLabel } from 'victory';

Geocode.setApiKey("AIzaSyDCTc_IuiXgVT8RmAAmyaOW4s3v3_22nlk");
Geocode.enableDebug();

class Linear extends Component {
  state = {
    year: "",
    month: "",
    type: "",
    loading: true,
    categories: [],
    count: []
  };
  handleChange = (e) => {
    this.setState({ [e.target.id || e.target.name]: e.target.value });
  }
  componentDidMount() {
    this.props.getReports().then((res) => this.setState({ loading: false, reports: res }))
  }


  groupByTipe = (newReports, no = false) => {
    var occurences = newReports.reduce(function (r, row) {
      r[row.groupBy] = (r[row.groupBy] || 0) + 1;
      return r;
    }, {});
    if (no) {
      var result = Object.keys(occurences).map(function (key) {
        return { x: key, y: occurences[key] };
      });
      result.unshift({ x: "      ", y: 0 })
      return result;
    }
    var result2 = Object.keys(occurences).map(function (key) {
      return { x: moment(key.toString(), 'MM').format('MMMM'), y: occurences[key] };
    });
    result2.unshift({ x: "      ", y: 0 })
    return result2;
  }

  filterReports = () => {
    const { year, month, type, } = this.state;
    let newReports = this.props.reports, newReportsByCat = [], count;
    if (type !== "") {
      newReports = newReports.filter((item) => item.tipo_reporte === type)
    }
    if (year !== "") {
      newReports = newReports.filter((item) => moment(item.fecha).format('YYYY').toString() === year);
      newReportsByCat = newReports.map((item) => {
        item.groupBy = moment().month(moment(item.fecha).format('MMMM')).format("M")
        return item;
      })
      count = this.groupByTipe(newReportsByCat)
    }
    if (month !== "") {
      newReports = newReports.filter((item) => { return moment().month(moment(item.fecha).format('MMMM')).format("M").toString() === month })

      newReportsByCat = newReports.map((item) => {
        item.groupBy = moment(item.fecha, 'YYYY/MM/DD').format('D');
        return item;
      })
      count = this.groupByTipe(newReportsByCat, true)
    };

    this.setState({ count: count })
    this.setState({ reports: newReports });
  }
  render() {
    const { month, year, type, loading, count } = this.state;
    return (
      <div className="reports-home-container">
        <div className="title-new-report flex-center">
          Estadisticas
 <div>Filtra y grafica los reportes por mes y tipo</div>
        </div>
        <div className="filter-container">
          <div className="icon-text">
            <CalendarToday style={{ color: "var(--color-blue-general)", position: "absolute", top: "29%" }} />
            <InputLabel id="demo-simple-select-label">Año</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="year"
              name="year"
              className="pd-10"
              value={year}
              onChange={this.handleChange}
            >
              <MenuItem id="year" value={"2019"}>2019</MenuItem>
              <MenuItem id="year" value={"2018"}>2018</MenuItem>
              <MenuItem id="year" value={"2017"}>2017</MenuItem>
            </Select>
          </div>
          <div className="icon-text">
            <CalendarToday style={{ color: "var(--color-blue-general)", position: "absolute", top: "29%" }} />
            <InputLabel id="demo-simple-select-label">Mes</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="month"
              name="month"
              className="pd-10"
              value={month}
              onChange={this.handleChange}
            >
              <MenuItem id="month" value={"01"}>Enero</MenuItem>
              <MenuItem id="month" value={"02"}>Febrero</MenuItem>
              <MenuItem id="month" value={"03"}>Marzo</MenuItem>
              <MenuItem id="month" value={"04"}>Abril</MenuItem>
              <MenuItem id="month" value={"05"}>Mayo</MenuItem>
              <MenuItem id="month" value={"06"}>Junio</MenuItem>
              <MenuItem id="month" value={"07"}>Julio</MenuItem>
              <MenuItem id="month" value={"08"}>Agosto</MenuItem>
              <MenuItem id="month" value={"09"}>Septiembre</MenuItem>
              <MenuItem id="month" value={"10"}>Octubre</MenuItem>
              <MenuItem id="month" value={"11"}>Noviembre</MenuItem>
              <MenuItem id="month" value={"12"}>Diciembre</MenuItem>
            </Select>
          </div>
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
        </div>
        {count.length > 1 && <VictoryChart>
          <VictoryLine
            data={count}
            style={{
              data: { fill: "#c43a31" }
            }}
            labels={({ datum }) => datum.y}
            labelComponent={<VictoryLabel renderInPortal dy={-10} />}
          />
        </VictoryChart>}
        {count.length === 1 && <div className="align-noresults">NO HAY RESULTADOS</div>}
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
export default connect(mapStateToProps, mapDispatchToProps)(Linear);
