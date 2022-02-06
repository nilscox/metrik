import superagent from 'superagent';
import { URL } from 'url';

const logger =
  (linePrefix: string) =>
  (...strings: Array<string | number>) => {
    strings
      .join(' ')
      .split('\n')
      .map((s) => [linePrefix, s].join(' '))
      .forEach((s) => console.log(s));
  };

export const logRequest: superagent.Plugin = (req) => {
  const log = logger('<');

  const headers = (req as any).header as Record<string, string>;
  const body = (req as any)._data;
  const url = new URL(req.url);

  log(req.method, url.pathname);

  for (const [key, value] of Object.entries(headers)) {
    log(`${key}: ${value}`);
  }

  log();
  log(JSON.stringify(body, null, 2));
};

export const logResponse: superagent.Plugin = (req) => {
  const log = logger('>');

  const url = new URL(req.url);

  req.on('response', (res) => {
    log(req.method, url.pathname, res.statusCode);

    for (const [key, value] of Object.entries(res.headers)) {
      log(`${key}: ${value}`);
    }

    log();
    log(JSON.stringify(res.body, null, 2));
  });
};

export const logReqRes: superagent.Plugin = (req) => {
  req
    .use(logRequest)
    .use(() => console.log())
    .use(logResponse);
};
