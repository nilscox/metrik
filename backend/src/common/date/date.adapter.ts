import { DatePort } from './date.port';

export class DateAdapter extends DatePort {
  get now(): Date {
    return new Date();
  }
}
