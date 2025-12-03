import { Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { OciService } from './oci.service';
import { ociConfig } from 'src/config/env';
import { GetIdParamDto } from '../user/dto';
import { JwtGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators/getCurrentUser.decorator';
import type { userPayload } from 'src/common/guards/types';
import type { Response } from 'express';

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
  async getUserAvatar(@Param() params: GetIdParamDto, @Res() res: Response) {
    const bucket = ociConfig.OCI_BUCKET_NAME;
    const objectName = `users/${params.id}.jpg`;
    try {
      await this.ociService.headObject(bucket, objectName);

      const { downloadUrl } = await this.ociService.createPresignedDownloadUrl(
        bucket,
        objectName,
        params.id,
        900,
      );

      return res.redirect(302, downloadUrl);
    } catch (err) {
      if (err.statusCode === 404) {
        return res.redirect(302, ociConfig.DEFAULT_USER_IMAGE);
      }

      throw err;
    }
  }
}
