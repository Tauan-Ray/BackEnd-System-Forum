import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OciService } from './oci.service';
import { ociConfig } from 'src/config/env';
import { GetIdParamDto } from '../user/dto';
import { JwtGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import type { userPayload } from 'src/common/guards/types';

@Controller('storage')
export class OciController {
  constructor(private readonly ociService: OciService) {}

  @Post('presign')
  @UseGuards(JwtGuard)
  async presign(@GetCurrentUser('payload') user: userPayload) {
    const { uploadUrl, objectUrl, expiresAt } = await this.ociService.createPresignedUploadUrl(
      user.sub,
    );

    return { uploadUrl, objectUrl, expiresAt };
  }

  @Get(':id/avatar')
  async getUserAvatar(@Param() params: GetIdParamDto) {
    const bucket = ociConfig.OCI_BUCKET_NAME;
    const objectName = `users/${params.id}.jpg`;

    const { downloadUrl, expiresAt } = await this.ociService.createPresignedDownloadUrl(
      bucket,
      objectName,
      900,
    );

    return { url: downloadUrl, expiresAt };
  }
}
