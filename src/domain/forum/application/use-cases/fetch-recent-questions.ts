import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'

import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface FetchRecentQuestionsUseCaseRequest {
  page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute(
    request: FetchRecentQuestionsUseCaseRequest,
  ): Promise<FetchRecentQuestionsUseCaseResponse> {
    const { page } = request

    const questions = await this.questionsRepository.findManyRecent({ page })

    return right({
      questions,
    })
  }
}
