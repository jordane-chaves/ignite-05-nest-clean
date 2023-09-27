import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { Attachment } from '../attachment'

export interface AnswerDetailsProps {
  answerId: UniqueEntityID
  questionId: UniqueEntityID
  authorId: UniqueEntityID
  author: string
  content: string
  attachments: Attachment[]
  createdAt: Date
  updatedAt?: Date | null
}

export class AnswerDetails extends ValueObject<AnswerDetailsProps> {
  get answerId() {
    return this.props.answerId
  }

  get questionId() {
    return this.props.questionId
  }

  get authorId() {
    return this.props.authorId
  }

  get author() {
    return this.props.author
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: AnswerDetailsProps) {
    return new AnswerDetails(props)
  }
}
