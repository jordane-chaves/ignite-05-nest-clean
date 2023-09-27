import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-details'

import { AttachmentPresenter } from './attachment-presenter'

export class AnswerDetailsPresenter {
  static toHTTP(answerDetails: AnswerDetails) {
    return {
      answerId: answerDetails.answerId.toString(),
      questionId: answerDetails.questionId.toString(),
      authorId: answerDetails.authorId.toString(),
      authorName: answerDetails.author,
      content: answerDetails.content,
      attachments: answerDetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: answerDetails.createdAt,
      updatedAt: answerDetails.updatedAt,
    }
  }
}
