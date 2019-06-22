import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import './css/mapbox-gl.css';
import Routes from './Router';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Routes />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
