import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { Attachment } from '../../enterprise/entities/attachment'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute(
    request: UploadAndCreateAttachmentUseCaseRequest,
  ): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    const { fileName, fileType, body } = request

    const isValidFileType = /^image\/(?:jpeg|png)$|^application\/pdf$/.test(
      fileType,
    )

    if (!isValidFileType) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
