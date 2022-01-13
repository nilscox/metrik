import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { MetricsStore } from '../domain/Metrics';

import { AuthenticationGuard } from './authentication-guard';
import { CreateSnapshotDto } from './create-snapshot-dto';
import { MetricsStoreToken } from './store/metrics-store-token';

@Controller('metrics')
@UsePipes(new ValidationPipe({ transform: true }))
export class MetricsController {
  @Inject(MetricsStoreToken)
  private readonly metricsStore: MetricsStore;

  @Post('create-snapshot')
  @UseGuards(AuthenticationGuard)
  async createSnapshot(@Body() dto: CreateSnapshotDto) {
    const snapshots = await this.metricsStore.getSnapshots();

    const createdSnapshot = snapshots.createSnapshot(new Date(), dto.metrics);

    await this.metricsStore.saveSnapshots(snapshots);

    return createdSnapshot;
  }

  @Get('all')
  @UseGuards(AuthenticationGuard)
  async getAllMetrics() {
    const snapshots = await this.metricsStore.getSnapshots();

    return snapshots.snapshots;
  }

  @Get('last')
  @UseGuards(AuthenticationGuard)
  async getLastMetrics() {
    const snapshots = await this.metricsStore.getSnapshots();

    return snapshots.getLast();
  }
}
