import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerConfigGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const user = req.user?.payload;
    if (user) {
      return user.sub;
    }

    return req.ips.length ? req.ips[0] : req.ip;
  }
}
