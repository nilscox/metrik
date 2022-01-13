import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { MetricsStore } from '../domain/Metrics';

import { CreateSnapshotDto } from './create-snapshot-dto';
import { MetricsStoreToken } from './store/metrics-store-token';

@Controller('metrics')
@UsePipes(new ValidationPipe({ transform: true }))
export class MetricsController {
  constructor(
    @Inject(MetricsStoreToken) private readonly metricsStore: MetricsStore,
  ) {}

  @Post('create-snapshot')
  async createSnapshot(@Body() dto: CreateSnapshotDto) {
    const snapshots = await this.metricsStore.getSnapshots();

    const createdSnapshot = snapshots.createSnapshot(new Date(), dto.metrics);

    await this.metricsStore.saveSnapshots(snapshots);

    return createdSnapshot;
  }

  @Get('all')
  async getAllMetrics() {
    const snapshots = await this.metricsStore.getSnapshots();

    return snapshots.snapshots;
  }

  @Get('last')
  async getLastMetrics() {
    const snapshots = await this.metricsStore.getSnapshots();

    return snapshots.getLast();
  }
}
