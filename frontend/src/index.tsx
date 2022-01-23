import ReactDOM from 'react-dom';

import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import './styles.css';

import { FetchHttpAdapter } from './adapters/FetchHttpAdapter';
import { App } from './App';
import { HttpProjectGateway } from './project/infrastructure/gateways/HttpProjectGateway';
import { createStore } from './store/store';

const API_URL = process.env.API_URL;
const TOKEN = process.env.TOKEN;
const PUBLIC_PATH = process.env.PUBLIC_PATH;

const http = new FetchHttpAdapter(fetch.bind(window), API_URL, TOKEN);
const store = createStore({ projectGateway: new HttpProjectGateway(http) });

ReactDOM.render(
  <ReduxProvider store={store}>
    <BrowserRouter basename={PUBLIC_PATH}>
      <App />
    </BrowserRouter>
  </ReduxProvider>,
  document.getElementById('app'),
);
