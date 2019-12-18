import React, { Component } from 'react'
import Geocode from "react-geocode";
import { connect } from 'react-redux';
import * as actions from "../../reports/actions";
import { CircularProgress } from '@material-ui/core';
import { ReportUser } from '../../../components/report';
import { showSnackbar } from "../actions";
import "./revision.css";
Geocode.setApiKey("AIzaSyDCTc_IuiXgVT8RmAAmyaOW4s3v3_22nlk");
Geocode.enableDebug();

class Revision extends Component {
    state = {
        loading: true,
        categories: [],
        count: [],
        count2: []
    };

    componentDidMount() {
        this.props.getReports().then((res) => {
            this.setState({ loading: false, reports: res })
        })
    }


    delete = (id) => {
        this.setState({ loading: false });
        this.props.onDeleteReport(id);
        this.props.showSnackbar("El reporte se ha eliminado sastifactoriamente!.", "success")
        this.props.getReports().then((res) => {
            this.setState({ loading: false, reports: res })
        })
    }

    render() {
        const { loading } = this.state;
        const { reports } = this.props;
        const denuncias = reports && reports.filter((item) => { return item.denuncias > 9 });
        const negativos = reports && reports.filter((item) => { return item.negativos > item.postivos });

        return (
            <div className="reports-home-container">
                <div className="title-new-report flex-center">
                    Revisión
 <div>Muestra los reportes con las denuncias altas por falsedad y alto numero de negativos</div>
                </div>
                <div className="title-revision">Denuncias por falso</div>
                {denuncias && Array.isArray(denuncias) && denuncias.length > 0 && !loading ?
                    denuncias.map((item, key) => {
                        return <ReportUser value={item} onDeleteReport={(e) => this.delete(e)} deleteReport key={key}></ReportUser>
                    })
                    : loading ? false : <div className="no-result">No se han encontrado resultados</div>}
                <div className="title-revision">Alto numero de negativos</div>
                {negativos && Array.isArray(negativos) && denuncias.length > 0 && !loading ?
                    negativos.map((item, key) => {
                        return <ReportUser value={item} onDeleteReport={(e) => this.delete(e)} deleteReport key={key}></ReportUser>
                    })

                    : loading ? false : <div className="no-result">No se han encontrado resultados</div>}
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
        getReports: () => { return actions.getReports()(dispatch) },
        onDeleteReport: (id) => { return actions.deleteReport(id)(dispatch) },
        showSnackbar: (message, type) => { dispatch(showSnackbar(message, type)) },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Revision);
