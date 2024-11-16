import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Token } from 'src/common/models/token';

@Injectable()
export class RequestUtilsService {
  getTokenInformation(request: Request) {
    const token = request['token'] as Token;
    return token;
  }

  getTokenFromRequestHeader(request: Request) {
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) throw new UnauthorizedException('no_token');
    return token as string;
  }

  setToken(request: Request, token: Token) {
    request['token'] = token;
  }
}
