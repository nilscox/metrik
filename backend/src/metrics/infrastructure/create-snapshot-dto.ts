import { IsDefined } from 'class-validator';

export class CreateSnapshotDto {
  @IsDefined()
  metrics!: Record<string, number>;
}
