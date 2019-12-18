import React from 'react'
import './home.css';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { ReportUser } from '../../../components/report';
import SearchIcon from '@material-ui/icons/Search';
import Add from '@material-ui/icons/AddCircleOutline';
import { connect } from 'react-redux';
import * as actions from "../../reports/actions";
import { getInfoUser } from "../actions";
import DetailReport from '../../reports/detailReport';

class Home extends React.Component {
    state = {
        loading: true,
        newReport: "",
        detailChoosed: false,
        search: "",
        reports: this.props.reports
    }
    async componentDidMount() {
        // if (this.props.reports) {
        //     return;
        // }
        await this.props.getReports();
        if (this.props.userById && this.props.userById.id) {
            this.props.getInfoUser(this.props.userById.id);
        }

        this.setState({ loading: false, reports: this.props.reports });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.reports !== this.props.reports) {
            this.setState({ reports: nextProps.reports });
        }
    }
    openDetail = (detail) => {
        this.props.history.push(`/reporte/${detail.id}`);
        this.setState({ detailChoosed: detail })
    }
    handleChange = (e) => {
        const value = e.target.value.toLowerCase();
        this.setState({ search: e.target.value });
        const reports = this.props.reports.filter((item) => {
            return (item.ubicacion !== null && item.ubicacion.toLowerCase().includes(value)) || item.usuario.nombres.toLowerCase().includes(value) || (item.descripcion !== null && item.descripcion.toLowerCase().includes(value));
        })
        this.setState({ reports })
    }
    render() {
        const { userById } = this.props;
        const { reports } = this.state;

        return (
            <div className="reports-home-container">
                <div className="report-search">
                    <TextField
                        className=""
                        id="userLogin"
                        label="Busqueda por descripción"
                        onChange={this.handleChange}
                        value={this.state.search}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon></SearchIcon>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                {userById && userById.ocupacion === "" && userById.estado === "" ? <div className="new-report">Para poder reportar, tiene que completar su perfil en Configuración</div> : userById ? <div className="new-report">
                    Hola {userById && userById.nombres}, ¿Quieres compartirnos algo hoy? <Link className="link-new-report" to="/nuevoreporte"> Crear reporte<Add /></Link>
                </div> : ""}
                {reports && Array.isArray(reports) ?
                    reports.map((item, key) => { return <ReportUser onClick={() => this.openDetail(item)} value={item} key={key}></ReportUser> })
                    : false}
                {this.props.match.params.id && this.state.detailChoosed && <DetailReport reload={() => this.reloadPage} location={this.props.history} detail={this.state.detailChoosed}></DetailReport>}
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
        getReports: () => { return actions.getReports()(dispatch) },
        getInfoUser: () => { return getInfoUser()(dispatch) }

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
