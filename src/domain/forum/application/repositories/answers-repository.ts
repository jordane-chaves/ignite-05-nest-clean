import { PaginationParams } from '@/core/repositories/pagination-params'

import { Answer } from '../../enterprise/entities/answer'
import { AnswerDetails } from '../../enterprise/entities/value-objects/answer-details'

export abstract class AnswersRepository {
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>

  abstract findManyWithDetailsByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<AnswerDetails[]>

  abstract findById(id: string): Promise<Answer | null>
  abstract create(answer: Answer): Promise<void>
  abstract save(answer: Answer): Promise<void>
  abstract delete(answer: Answer): Promise<void>
}
