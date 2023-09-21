import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachmentProps,
  AnswerAttachment,
} from '@/domain/forum/enterprise/entities/answer-attachment'

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
): AnswerAttachment {
  const answerAttachment = AnswerAttachment.create(
    {
      attachmentId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return answerAttachment
}
