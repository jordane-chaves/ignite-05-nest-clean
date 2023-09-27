import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository

let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    const answer1 = makeAnswer({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const answer2 = makeAnswer({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const answer3 = makeAnswer({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryAnswersRepository.create(answer1)
    await inMemoryAnswersRepository.create(answer2)
    await inMemoryAnswersRepository.create(answer3)

    const attachment = makeAttachment({
      title: 'Some attachment',
    })

    inMemoryAttachmentsRepository.items.push(attachment)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: answer1.id,
        attachmentId: attachment.id,
      }),
      makeAnswerAttachment({
        answerId: answer2.id,
        attachmentId: attachment.id,
      }),
      makeAnswerAttachment({
        answerId: answer3.id,
        attachmentId: attachment.id,
      }),
    )

    const result = await sut.execute({ questionId: 'question-1', page: 1 })

    expect(result.value?.answers).toHaveLength(3)
    expect(result.value?.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          answerId: answer1.id,
          author: 'John Doe',
          attachments: [
            expect.objectContaining({
              title: 'Some attachment',
            }),
          ],
        }),
        expect.objectContaining({
          answerId: answer2.id,
          author: 'John Doe',
          attachments: [
            expect.objectContaining({
              title: 'Some attachment',
            }),
          ],
        }),
        expect.objectContaining({
          answerId: answer3.id,
          author: 'John Doe',
          attachments: [
            expect.objectContaining({
              title: 'Some attachment',
            }),
          ],
        }),
      ]),
    )
  })

  it('should be able to fetch paginated question answers', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({ questionId: 'question-1', page: 2 })

    expect(result.value?.answers).toHaveLength(2)
  })
})
