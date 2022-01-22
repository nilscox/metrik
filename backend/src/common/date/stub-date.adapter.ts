import { DatePort } from './date.port';

export class StubDateAdapter extends DatePort {
  public date = new Date();

  set now(date: Date) {
    this.date = date;
  }

  get now(): Date {
    return this.date;
  }
}
