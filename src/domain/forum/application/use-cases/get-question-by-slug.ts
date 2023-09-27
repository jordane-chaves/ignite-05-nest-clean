import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { QuestionsRepository } from '../repositories/questions-repository'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails
  }
>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute(
    request: GetQuestionBySlugUseCaseRequest,
  ): Promise<GetQuestionBySlugUseCaseResponse> {
    const { slug } = request

    const question = await this.questionsRepository.findDetailsBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({
      question,
    })
  }
}
