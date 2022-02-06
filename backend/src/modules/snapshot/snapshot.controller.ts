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

import { DatePort } from '~/common/date';
import { GeneratorPort } from '~/common/generator';

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
  constructor(
    private readonly generator: GeneratorPort,
    private readonly date: DatePort,
    private readonly snapshotService: SnapshotService,
  ) {}

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
      id: await this.generator.generateId(),
      branch: dto.branch,
      ref: dto.ref,
      date: this.date.now,
      projectId,
      metrics: await Promise.all(
        dto.metrics.map(async (metric) => ({
          id: await this.generator.generateId(),
          ...metric,
        })),
      ),
    });

    return new SnapshotDto(snapshot);
  }
}
