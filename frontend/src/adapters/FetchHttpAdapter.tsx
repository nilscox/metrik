import { HttpPort, HttpResponse } from '../ports/HttpPort';

export type Fetch = typeof fetch;

export class FetchHttpAdapter implements HttpPort {
  constructor(private readonly fetch: Fetch, private baseUrl: string, private token?: string) {}

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

    if (this.token) {
      headers.set('Authorization', `Beer ${this.token}`);
    }

    if (body && typeof body === 'object') {
      headers.set('Content-Type', 'application/json');
    }

    const response = await this.fetch(this.baseUrl + route, {
      method,
      headers,
    });

    if (!response.ok) {
      throw new Error(`${method} ${route} => ${response.status} (${response.statusText})`);
    }

    return {
      status: response.status,
      body: await response.json(),
    };
  }
}
