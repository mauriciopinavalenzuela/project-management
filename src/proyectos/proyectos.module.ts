import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity'; // Ajusta a 'User' para coincidir con la clase exportada
import { AuthModule } from '../auth/auth.module'; // Importa AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User]), // Registro de entidades en TypeOrm
    AuthModule, // Importación de AuthModule para autenticación
  ],
  controllers: [ProyectosController], // Controladores que manejan los endpoints de proyectos
  providers: [ProyectosService], // Servicio que contiene la lógica de negocio
  exports: [ProyectosService], // Exporta el servicio para otros módulos
})
export class ProyectosModule {}
