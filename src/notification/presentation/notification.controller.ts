import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt.guard';
import { GetUser } from '../../auth/presentation/decorators/get-user.decorator';
import { SendMaintenanceAlertUseCase } from '../application/use-cases/send-maintenance-alert.use-case';
import {
  NotificationRepositoryPort,
  NOTIFICATION_REPOSITORY,
} from '../application/ports/notification.repository.port';
import { Inject } from '@nestjs/common';
import { NotificationResponseDto } from './dtos/notification-response.dto';
import { SendMaintenanceAlertDto } from './dtos/send-maintenance-alert.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly sendMaintenanceAlertUseCase: SendMaintenanceAlertUseCase,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  @Get('user')
  @HttpCode(200)
  async getUserNotifications(
    @GetUser() user: { id: string },
  ): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationRepository.findByUserId(
      user.id,
    );
    return NotificationResponseDto.mapMultiple(notifications);
  }

  @Get(':id')
  @HttpCode(200)
  async getNotification(
    @Param('id') notificationId: string,
  ): Promise<NotificationResponseDto> {
    try {
      const notification =
        await this.notificationRepository.findById(notificationId);

      if (!notification) {
        throw new BadRequestException('Notification not found');
      }

      return new NotificationResponseDto(notification);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to get notification: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Post('send-alert')
  @HttpCode(201)
  async sendMaintenanceAlert(
    @GetUser() user: { id: string; email: string },
    @Body() dto: SendMaintenanceAlertDto,
  ): Promise<NotificationResponseDto> {
    try {
      const notification = await this.sendMaintenanceAlertUseCase.execute({
        userId: user.id,
        userEmail: user.email,
        ...dto,
      });

      return new NotificationResponseDto(notification);
    } catch (error) {
      throw new BadRequestException(
        `Failed to send maintenance alert: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
