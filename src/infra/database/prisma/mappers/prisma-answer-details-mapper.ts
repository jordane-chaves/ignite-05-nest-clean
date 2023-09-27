import {
  Answer as PrismaAnswer,
  User as PrismaUser,
  Attachment as PrismaAttachments,
} from '@prisma/client'
import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-details'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaAnswerDetails = PrismaAnswer & {
  author: PrismaUser
  attachments: PrismaAttachments[]
}

export class PrismaAnswerDetailsMapper {
  static toDomain(raw: PrismaAnswerDetails): AnswerDetails {
    return AnswerDetails.create({
      answerId: new UniqueEntityID(raw.id),
      questionId: new UniqueEntityID(raw.questionId),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
