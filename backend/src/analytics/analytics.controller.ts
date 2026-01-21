import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/get-user.decorator';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Obter visão geral das métricas' })
  getOverview(@GetUser() userId: string) {
    return this.analyticsService.getOverview(userId);
  }

  @Get('productivity')
  @ApiOperation({ summary: 'Obter dados de produtividade' })
  getProductivity(@GetUser() userId: string) {
    return this.analyticsService.getProductivity(userId);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Obter tendências temporais' })
  getTrends(@GetUser() userId: string) {
    return this.analyticsService.getTrends(userId);
  }
}
