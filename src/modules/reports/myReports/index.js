import React, { Component } from 'react'
import Geocode from "react-geocode";
import { connect } from 'react-redux';
import * as actions from "../../reports/actions";
import { CircularProgress } from '@material-ui/core';
import { ReportUser } from '../../../components/report';
import { showSnackbar } from "../../usuarios/actions";
Geocode.setApiKey("AIzaSyDCTc_IuiXgVT8RmAAmyaOW4s3v3_22nlk");
Geocode.enableDebug();

class MyReports extends Component {
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


    delete = async (id) => {
        this.setState({ loading: true });
        await this.props.onDeleteReport(id);
        this.props.showSnackbar("El reporte se ha eliminado sastifactoriamente!.", "success")
        this.props.getReports().then((res) => {
            this.setState({ loading: false, reports: res })
        })
    }

    render() {
        const { loading } = this.state;
        const { reports, userById } = this.props;

        return (
            <div className="reports-home-container">
                <div className="title-new-report flex-center">
                    Mis reportes
 <div>Mira tus reportes, tienes la opción de eliminarlos.</div>
                </div>
                {reports && userById && Array.isArray(reports) && reports.length > 0 && !loading ?
                    reports.map((item, key) => {
                        if (item.usuario.id === userById.id) {
                            return <ReportUser value={item} onDeleteReport={(e) => this.delete(e)} deleteReport key={key}></ReportUser>
                        }
                        return false;
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
export default connect(mapStateToProps, mapDispatchToProps)(MyReports);
