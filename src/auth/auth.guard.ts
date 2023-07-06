import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from './constants';
  import { Request } from 'express';
  import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { ROLES_KEY } from './decorators/roles.decorator';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        //get metadata IS_PUBLIC_KEY
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);

          if (isPublic) {
            // 💡 See this condition
            return true;
          }

      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: jwtConstants.secret
          }
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;

      } catch {
        throw new UnauthorizedException();
      }
      const { user } = context.switchToHttp().getRequest();

      //get metadata ROLE_KEYS
      const requiredRole = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
        context.getHandler(), context.getClass(),
      ]);
      
      //const _user = context.switchToHttp().getRequest().user;
      const url = context.switchToHttp().getRequest().url;
      const params = context.switchToHttp().getRequest().params;
      const getIdUrlReg = new RegExp("^(/user/).*");
      
      //if trying to get id
      if (getIdUrlReg.test(url)) {
        const _id = url.split('/')[2];
        //console.log(`Hello ${user.sub} ${_id}`)
        if (user.role == 'admin' || user.sub == params.id)
          return true;
        return false;
      }
      
      console.log(requiredRole);
      //if there is no roles attached then all required is authenticated (equal to authenticated() in JAVA)
      if (!requiredRole)
        return true;
      
      //console.log(user?.role, requiredRole);
      return requiredRole == user.role;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }