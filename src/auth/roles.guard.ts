import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly requiredRole: string) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request || !request.user) {
      this.logger.error('❌ [RolesGuard] Request o usuario no definido.');
      throw new ForbiddenException('Acceso denegado. Información del usuario no disponible.');
    }

    const user = request.user;
    this.logger.log(`🔍 [RolesGuard] Validando rol del usuario: ${JSON.stringify(user)}`);

    if (!user.role) {
      this.logger.error('❌ [RolesGuard] Acceso denegado. Rol del usuario no definido.');
      throw new ForbiddenException('Acceso denegado. Rol no definido.');
    }

    if (user.role !== this.requiredRole) {
      this.logger.error(
        `❌ [RolesGuard] Acceso denegado. Rol requerido: ${this.requiredRole}, pero el usuario tiene el rol: ${user.role}`,
      );
      throw new ForbiddenException(
        `Acceso denegado. Se requiere el rol: ${this.requiredRole}, pero el usuario tiene: ${user.role}`,
      );
    }

    this.logger.log(`✅ [RolesGuard] Acceso permitido. Usuario: ${user.username}, Rol: ${user.role}`);
    return true;
  }
}
