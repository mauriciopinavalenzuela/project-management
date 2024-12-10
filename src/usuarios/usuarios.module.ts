import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { User } from '../entities/user.entity'; // Cambiado a 'User'
import { AuthModule } from '../auth/auth.module'; // Ruta relativa al módulo de autenticación

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Actualizado para reflejar el cambio a 'User'
    AuthModule, // Importa el módulo de autenticación
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
