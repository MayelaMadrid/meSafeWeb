import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Sidebar from "./components/sidebar";
import Alerts from "./components/alerts";
const PrivateRoute = ({ component: Component = null, render: Render = null, connection, ...rest }) => {
    return (
        < Route {...rest} render={props => (
            (sessionStorage.getItem("username") && sessionStorage.getItem("password")) || (localStorage.getItem("username") && localStorage.getItem("password")) ?
                (Render ? (Render(props)) :
                    Component ? (
                        <div className="home-container container">
                            <Sidebar connection={connection} />
                            <Component {...props} {...rest} />
                            <Alerts></Alerts>
                        </div>
                    ) : null)

                : <Redirect to="/login" />
        )} />
    );
};



export default PrivateRoute;