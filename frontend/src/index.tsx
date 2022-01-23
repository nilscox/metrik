import ReactDOM from 'react-dom';

import { Provider as ReduxProvider } from 'react-redux';

import { IProjectDto } from '../../dtos/project/IProjectDto';

import { App } from './App';
import { ProjectGateway } from './store/ProjectGateway';
import { createStore } from './store/store';

type HttpResponse<Body> = {
  status: number;
  body: Body;
};

interface HttpAdapter {
  get<ResponseBody>(url: string): Promise<HttpResponse<ResponseBody>>;
  post<ResponseBody, RequestBody>(url: string, body: RequestBody): Promise<HttpResponse<ResponseBody>>;
}

type Fetch = typeof fetch;

class FetchHttpAdapter implements HttpAdapter {
  constructor(private readonly fetch: Fetch) {}

  get<ResponseBody>(route: string): Promise<HttpResponse<ResponseBody>> {
    return this.request('GET', route);
  }

  post<ResponseBody, RequestBody>(route: string, body: RequestBody): Promise<HttpResponse<ResponseBody>> {
    return this.request('POST', route, body);
  }

  private async request<ResponseBody, RequestBody>(
    method: string,
    route: string,
    body?: RequestBody,
  ): Promise<HttpResponse<ResponseBody>> {
    const headers = new Headers();

    headers.set('Authorization', 'Beer strtok_r');

    if (body && typeof body === 'object') {
      headers.set('Content-Type', 'application/json');
    }

    const response = await this.fetch('http://localhost:3000' + route, {
      method,
      headers,
    });

    return {
      status: response.status,
      body: await response.json(),
    };
  }
}

class HttpProjectGateway implements ProjectGateway {
  constructor(private readonly http: HttpAdapter) {}

  async fetchProjects(): Promise<IProjectDto[]> {
    const response = await this.http.get<IProjectDto>('/project/1');

    return [response.body];
  }
}

const http = new FetchHttpAdapter(fetch.bind(window));
const store = createStore({ projectGateway: new HttpProjectGateway(http) });

ReactDOM.render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>,
  document.getElementById('app'),
);
