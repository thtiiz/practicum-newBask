import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bulma/css/bulma.css'
import './index.css';
import { BrowserRouter } from 'react-router-dom'

const AppWithRouter = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
)


ReactDOM.render(
    <AppWithRouter />,
    document.getElementById('root')
);
