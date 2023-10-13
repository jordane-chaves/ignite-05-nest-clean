import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerDetails } from '@/domain/forum/enterprise/entities/value-objects/answer-details'

import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaAnswerDetailsMapper } from '../mappers/prisma-answer-details-mapper'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answersAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async findManyWithDetailsByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<AnswerDetails[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      include: {
        author: true,
        attachments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map(PrismaAnswerDetailsMapper.toDomain)
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({
      data,
    })

    await this.answersAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.answersAttachmentsRepository.createMany(
        answer.attachments.getNewItems(),
      ),
      this.answersAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ])

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    })
  }
}
