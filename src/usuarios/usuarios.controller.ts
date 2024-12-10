import { Controller, Post, Patch, Param, Body, UseGuards, Req, Logger, BadRequestException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUserDto } from '../dto/create-user.dto'; // Actualizado
import { LoginUserDto } from '../dto/login-user.dto'; // Actualizado
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('users') // Asegúrate de que coincide con el cambio en tu entidad
export class UsuariosController {
  private readonly logger = new Logger(UsuariosController.name);

  constructor(private readonly usuariosService: UsuariosService) {}

  // Endpoint: POST /users
  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`📂 Registrando nuevo usuario: ${createUserDto.username}`);
    try {
      const result = await this.usuariosService.create(createUserDto);
      this.logger.log(`✅ Usuario registrado exitosamente: ${result.username}`);
      return { message: 'Usuario registrado exitosamente.', data: result };
    } catch (error) {
      this.logger.error(
        `❌ Error al registrar usuario: ${createUserDto.username}`,
        error.stack,
      );
      throw new BadRequestException(
        error.message || 'Error al registrar el usuario.',
      );
    }
  }

  // Endpoint: POST /users/login
  @Post('/login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  async login(@Body() loginUserDto: LoginUserDto) {
    this.logger.log(
      `🔑 Intentando iniciar sesión: ${loginUserDto.email || loginUserDto.username}`,
    );
    try {
      const accessToken = await this.usuariosService.login(loginUserDto);
      this.logger.log(
        `✅ Sesión iniciada exitosamente para: ${loginUserDto.email || loginUserDto.username}`,
      );
      return { message: 'Sesión iniciada exitosamente.', access_token: accessToken };
    } catch (error) {
      this.logger.error(
        `❌ Error al iniciar sesión: ${loginUserDto.email || loginUserDto.username}`,
        error.stack,
      );
      throw new BadRequestException(error.message || 'Error al iniciar sesión.');
    }
  }

  // Endpoint: PATCH /users/password
  @UseGuards(AuthGuard)
  @ApiBearerAuth() // Requiere autenticación en Swagger
  @Patch('/password')
  @ApiOperation({ summary: 'Cambiar contraseña del usuario autenticado' })
  async updatePassword(@Req() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    this.logger.log(`🔒 Intentando cambiar contraseña para el usuario: ${req.user.username}`);
    try {
      const result = await this.usuariosService.updatePassword(req.user.username, updatePasswordDto);
      this.logger.log(`✅ Contraseña actualizada exitosamente para el usuario: ${req.user.username}`);
      return { message: result.message };
    } catch (error) {
      this.logger.error(
        `❌ Error al cambiar contraseña para el usuario: ${req.user.username}`,
        error.stack,
      );
      throw new BadRequestException(error.message || 'Error al cambiar la contraseña.');
    }
  }

  // Endpoint: PATCH /users/:username/role
  @UseGuards(AuthGuard, new RolesGuard('admin'))
  @ApiBearerAuth() // Requiere autenticación en Swagger
  @Patch('/:username/role')
  @ApiOperation({ summary: 'Cambiar el rol de un usuario' })
  async updateRole(@Param('username') username: string, @Body() updateRoleDto: UpdateRoleDto) {
    this.logger.log(`🔑 Intentando cambiar el rol del usuario: ${username} a ${updateRoleDto.newRole}`);
    try {
      const result = await this.usuariosService.updateRole(username, updateRoleDto);
      this.logger.log(`✅ Rol actualizado exitosamente para el usuario: ${username}`);
      return { message: result.message };
    } catch (error) {
      this.logger.error(
        `❌ Error al cambiar el rol del usuario: ${username}`,
        error.stack,
      );
      throw new BadRequestException(error.message || 'Error al cambiar el rol.');
    }
  }
}
