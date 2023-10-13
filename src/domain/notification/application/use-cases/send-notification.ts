import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute(
    request: SendNotificationUseCaseRequest,
  ): Promise<SendNotificationUseCaseResponse> {
    const { content, recipientId, title } = request

    const notification = Notification.create({
      content,
      title,
      recipientId: new UniqueEntityID(recipientId),
    })

    await this.notificationsRepository.create(notification)

    return right({
      notification,
    })
  }
}
