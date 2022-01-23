export type HttpResponse<Body> = {
  status: number;
  body: Body;
};

export interface HttpPort {
  get<ResponseBody>(url: string): Promise<HttpResponse<ResponseBody>>;
  post<ResponseBody, RequestBody>(url: string, body: RequestBody): Promise<HttpResponse<ResponseBody>>;
}
