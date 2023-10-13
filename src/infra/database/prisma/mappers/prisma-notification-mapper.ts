import { Prisma, Notification as PrismaNotification } from '@prisma/client'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityID(raw.recipientId),
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      recipientId: notification.recipientId.toString(),
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    }
  }
}
