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

import { IsAuthenticatedGuard } from '~/modules/authorization';

import { MetricsStore } from '../domain/Metrics';

import { CreateSnapshotDto } from './create-snapshot-dto';
import { MetricsStoreToken } from './store/metrics-store-token';

@Controller('metrics')
@UsePipes(new ValidationPipe({ transform: true }))
export class MetricsController {
  @Inject(MetricsStoreToken)
  private readonly metricsStore!: MetricsStore;

  @Post('create-snapshot')
  @UseGuards(IsAuthenticatedGuard)
  async createSnapshot(@Body() dto: CreateSnapshotDto) {
    const snapshots = await this.metricsStore.getSnapshots();

    const createdSnapshot = snapshots.createSnapshot(new Date(), dto.metrics);

    await this.metricsStore.saveSnapshots(snapshots);

    return createdSnapshot;
  }

  @Get('all')
  @UseGuards(IsAuthenticatedGuard)
  async getAllMetrics() {
    const snapshots = await this.metricsStore.getSnapshots();

    return snapshots.snapshots;
  }

  @Get('last')
  @UseGuards(IsAuthenticatedGuard)
  async getLastMetrics() {
    const snapshots = await this.metricsStore.getSnapshots();

    return snapshots.getLast();
  }
}
