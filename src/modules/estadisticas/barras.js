import React, { Component } from 'react'
import Geocode from "react-geocode";
import "./estadisticas.css";
import { connect } from 'react-redux';
import * as moment from 'moment';
import * as actions from "../reports/actions";
import { CircularProgress } from '@material-ui/core';
import { VictoryChart, VictoryBar, VictoryGroup } from 'victory';
import { findColorByType } from '../../utils';

Geocode.setApiKey("AIzaSyDCTc_IuiXgVT8RmAAmyaOW4s3v3_22nlk");
Geocode.enableDebug();

class Barras extends Component {
  state = {
    loading: true,
    categories: [],
    count: [],
    count2: []
  };

  componentDidMount() {
    this.props.getReports().then((res) => {
      this.filterReport(res, moment().subtract(1, 'months').endOf('month').format('MM'), "count2");
      this.filterReport(res, moment().format('MM'), "count");
      this.setState({ loading: false, reports: res })
    })
  }

  filterReport = (newReports, month, state) => {
    newReports = newReports.filter((item) => { return moment().month(moment(item.fecha).format('MMMM')).format("M").toString() === month });
    this.groupByTipe(newReports, state);
  }

  groupByTipe = (newReports, state) => {

    const findTypeById = (key) => findColorByType(key)
    var occurences = newReports.reduce(function (r, row) {
      r[row.tipo_reporte] = (r[row.tipo_reporte] || 0) + 1;
      return r;
    }, {});
    var result = Object.keys(occurences).map(function (key) {
      return { x: findTypeById(key), y: occurences[key] };
    });
    this.setState({ [state]: result })
  }


  render() {
    const { loading, count, count2 } = this.state;
    return (
      <div className="reports-home-container">
        <div className="title-new-report flex-center">
          Estadisticas
 <div>La grafica muestra la comparacion de incidentes entre este mes y el pasado</div>
        </div>
        <div className="colors-type">
          <div><div style={{ background: "rgb(51, 77, 92)" }} className="span-type" />Mes actual</div>
          <div><div style={{ background: "rgb(69, 178, 157)" }} className="span-type" />Mes pasado</div>
        </div>
        {count.length > 1 &&
          <VictoryChart>
            <VictoryGroup offset={20}
              colorScale={"qualitative"}
            >
              <VictoryBar
                data={count}
              />
              <VictoryBar
                data={count2}
              />
            </VictoryGroup>
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
export default connect(mapStateToProps, mapDispatchToProps)(Barras);
