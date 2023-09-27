import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'

import { AnswerDetails } from '../../enterprise/entities/value-objects/answer-details'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: AnswerDetails[]
  }
>

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute(
    request: FetchQuestionAnswersUseCaseRequest,
  ): Promise<FetchQuestionAnswersUseCaseResponse> {
    const { questionId, page } = request

    const answers =
      await this.answersRepository.findManyWithDetailsByQuestionId(questionId, {
        page,
      })

    return right({
      answers,
    })
  }
}
