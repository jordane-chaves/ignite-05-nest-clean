import { PaginationParams } from '@/core/repositories/pagination-params'

import { Answer } from '../../enterprise/entities/answer'

export abstract class AnswersRepository {
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>

  abstract findById(id: string): Promise<Answer | null>
  abstract create(answer: Answer): Promise<void>
  abstract save(answer: Answer): Promise<void>
  abstract delete(answer: Answer): Promise<void>
}
