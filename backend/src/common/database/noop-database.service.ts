import { DatabaseService } from './database.service';

export class NoopDatabaseService extends DatabaseService {
  override get isConnected(): boolean {
    return false;
  }
}
