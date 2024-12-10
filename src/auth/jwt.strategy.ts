import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del encabezado Authorization
      ignoreExpiration: false, // Asegura que los tokens expirados sean rechazados
      secretOrKey: process.env.JWT_SECRET || 'mysecretkey', // Llave secreta (aquí estaba funcionando)
    });
  }

  async validate(payload: any) {
    this.logger.log(`[JwtStrategy] Validando payload del token.`);

    if (!payload) {
      this.logger.error(`[JwtStrategy] El payload está vacío.`);
      throw new UnauthorizedException('Token inválido o incompleto.');
    }

    if (!payload.username || !payload.role) {
      this.logger.error(
        `[JwtStrategy] El payload no contiene los datos requeridos: ${JSON.stringify(
          payload,
        )}`,
      );
      throw new UnauthorizedException('Token inválido o incompleto.');
    }

    this.logger.log(`[JwtStrategy] Token válido. Usuario: ${payload.username}, Rol: ${payload.role}`);
    return { username: payload.username, role: payload.role }; // Retorna los datos del usuario autenticado
  }
}

