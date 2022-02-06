import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { IsAuthenticated } from '../authorization';

import { SnapshotService } from './application/snapshot.service';
import { CreateSnapshotDto } from './dtos/create-snapshot.dto';
import { SnapshotDto } from './dtos/snapshot.dto';

@Controller('project/:projectId/metrics-snapshot')
@UseGuards(IsAuthenticated)
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class SnapshotController {
  constructor(private readonly snapshotService: SnapshotService) {}

  @Get()
  async getSnapshots(@Param('projectId') projectId: string): Promise<SnapshotDto[]> {
    const snapshots = await this.snapshotService.findAllForProjectId(projectId);

    return snapshots.map((snapshot) => new SnapshotDto(snapshot));
  }

  @Post()
  async createSnapshot(
    @Param('projectId') projectId: string,
    @Body() dto: CreateSnapshotDto,
  ): Promise<SnapshotDto> {
    const snapshot = await this.snapshotService.createSnapshot({
      projectId,
      branch: dto.branch,
      ref: dto.ref,
      metrics: dto.metrics,
    });

    return new SnapshotDto(snapshot);
  }
}
