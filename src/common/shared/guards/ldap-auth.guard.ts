import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LdapAuthGuard extends AuthGuard('ldap') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context, status) {
    // You can throw an exception based on either "info" or "err" arguments
    if (!err && !user) {
      if (status === 401) {
        throw new UnauthorizedException(info.message);
      } else {
        throw new BadRequestException(info.message);
      }
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
