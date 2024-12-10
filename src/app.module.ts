import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ProyectosModule } from './proyectos/proyectos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'project_management',
      autoLoadEntities: true,
      synchronize: true, // Sincroniza entidades automáticamente (solo en desarrollo)
    }),
    UsuariosModule,
    AuthModule,
    ProyectosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
