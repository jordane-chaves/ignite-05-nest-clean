import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created'

import { SendNotificationUseCase } from '../use-cases/send-notification'

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    // A função `sendNewAnswerNotification` será chamada pela classe `DomainEvents`,
    // sendo assim é utilizado o `bind` para informar que quando a função for chamada,
    // dentro dela o `this` tem que ser o mesmo this deste momento, ou seja,
    // o this é a referência dessa classe `OnAnswerCreated`.
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this), // função a ser disparada quando o evento acontecer
      AnswerCreatedEvent.name, // nome do evento que será "ouvido"
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title
          .substring(0, 40)
          .concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
