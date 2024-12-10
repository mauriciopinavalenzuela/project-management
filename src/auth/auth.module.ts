import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultsecret', // Usa 'defaultsecret' si no está definido
      signOptions: { expiresIn: '1h' }, // Configurar el tiempo de expiración
    }),
  ],
  providers: [AuthService, JwtStrategy, AuthGuard], // Proveedores del módulo
  exports: [AuthService, JwtModule, PassportModule, AuthGuard], // Exportaciones necesarias
})
export class AuthModule {}
