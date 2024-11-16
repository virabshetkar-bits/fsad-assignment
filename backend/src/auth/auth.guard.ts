import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestUtilsService } from 'src/common/services/request-utils/request-utils.service';
import { Token } from '../common/models/token';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
    private jwtService: JwtService,
    private requestUtils: RequestUtilsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.requestUtils.getTokenFromRequestHeader(request);

    try {
      const payload = await this.jwtService.verifyAsync<Token>(token);
      this.requestUtils.setToken(request, payload);
    } catch (err) {
      throw new UnauthorizedException('invalid_token');
    }

    return true;
  }
}
