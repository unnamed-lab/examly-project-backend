import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
}
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      console.log({ secret });
      // Verify token and get payload
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret,
      });

      // Ensure required fields exist in payload
      if (!payload.userId || !payload.email) {
        throw new UnauthorizedException('Invalid token payload');
      }

      console.log('Decoded Payload:', payload);

      // Attach user to request object
      request.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role || 'user', // Default role if not specified
      };

      return true;
    } catch (error) {
      console.error('JWT Verification Error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
