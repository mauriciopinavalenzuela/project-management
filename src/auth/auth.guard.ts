import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    this.logger.log(`[AuthGuard] Verificando encabezado de autorización.`);

    if (!authorizationHeader) {
      this.logger.error(`[AuthGuard] Encabezado de autorización no proporcionado.`);
      throw new UnauthorizedException('Token no proporcionado.');
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
      this.logger.error(`[AuthGuard] Token no encontrado en el encabezado.`);
      throw new UnauthorizedException('Token no proporcionado.');
    }

    try {
      this.logger.log(`[AuthGuard] Verificando token: ${token}`);
      const payload = this.jwtService.verify(token); // Verifica el token
      this.logger.log(`[AuthGuard] Token válido. Payload: ${JSON.stringify(payload)}`);
      request.user = payload; // Asocia el usuario autenticado al request
      return true;
    } catch (error) {
      this.logger.error(`[AuthGuard] Token inválido o expirado: ${error.message}`);
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }
}
