import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as actions from "../actions";
import Bomberos from "../../../images/bomberos.svg"
import Policia from "../../../images/policia.svg"
import Hospital from "../../../images/farmacia.svg"
import Instituciones from "../../../images/caridad.svg"
import "./emergency.css";
class HelpCenter extends Component {
    componentDidMount() {
        this.props.getCenters();
    }

    fingImgByType = (type) => {
        if (type === "Instituciones") return Instituciones;
        if (type === "Hospital") return Hospital;
        if (type === "Policia") return Policia;
        if (type === "Bomberos") return Bomberos;
    }
    render() {
        return (
            <div className="reports-home-container">
                <div className="title-new-report flex-center">
                    Números de emergencia
<div>Localiza o llama los centros de ayuda de tu ciudad</div>
                </div>
                {this.props.centers &&
                    this.props.centers.map((item, key) => {
                        return <div key={key} className="centers-container">
                            <img src={this.fingImgByType(item.tipo)} alt="" />
                            <div>
                                <div className="bold">{item.nombre}</div>
                                <div>{item.direccion}</div>
                                <div>Tel: {item.numero}</div>

                            </div>
                        </div>
                    })
                }
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        centers: state.Usuarios.centers
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCenters: () => { actions.getHelpCenter()(dispatch) }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(HelpCenter);
