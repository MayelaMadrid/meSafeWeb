
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import firebase from 'firebase';
import { firebaseConfig } from './firebaseInfo';
import './index.css';
import App from './App';
const theme = createMuiTheme({
    palette: {
        primary: { main: '#4574BA' },
        secondary: { main: '#4574BA' },
    },
});
ReactDOM.render(
    <Provider store={configureStore()}>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);
firebase.initializeApp(firebaseConfig);