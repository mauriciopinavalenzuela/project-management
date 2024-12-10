import { Injectable, ConflictException, NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2'; // Cambiado a argon2 para el hash de contraseñas
import { JwtService } from '@nestjs/jwt';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { User } from '../entities/user.entity'; // Ajustado para reflejar el cambio a 'User'
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    @InjectRepository(User) // Actualizado a la entidad 'User'
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, role } = createUserDto;

    this.logger.log(`📝 Intentando registrar un nuevo usuario: ${username}`);

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      this.logger.warn(`⚠️ Usuario o email ya existente: ${username} o ${email}`);
      throw new ConflictException('El usuario o email ya existe.');
    }

    const passwordHash = await argon2.hash(password);
    this.logger.log(`🔒 Contraseña hasheada para el usuario: ${username}`);

    const newUser = this.userRepository.create({
      username,
      email,
      passwordHash,
      role: role || 'user',
    });

    const result = await this.userRepository.save(newUser);
    this.logger.log(`✅ Usuario registrado exitosamente: ${result.username}`);
    return result;
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const { email, username, password } = loginUserDto;

    this.logger.log(`🔑 Intentando iniciar sesión para: ${email || username}`);

    const user = await this.userRepository.findOne({
      where: email ? { email } : { username },
    });
    if (!user) {
      this.logger.warn(`⚠️ Credenciales inválidas para: ${email || username}`);
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      this.logger.warn(`⚠️ Contraseña inválida para: ${email || username}`);
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const payload = { username: user.username, role: user.role };
    const token = this.jwtService.sign(payload);
    this.logger.log(`✅ JWT generado exitosamente para: ${user.username}`);
    return token;
  }

  async updatePassword(
    username: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = updatePasswordDto;

    this.logger.log(`🔒 Intentando cambiar contraseña para el usuario: ${username}`);

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      this.logger.warn(`⚠️ Usuario no encontrado: ${username}`);
      throw new NotFoundException('Usuario no encontrado.');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, currentPassword);
    if (!isPasswordValid) {
      this.logger.warn(`⚠️ Contraseña actual inválida para el usuario: ${username}`);
      throw new UnauthorizedException('Contraseña actual inválida.');
    }

    user.passwordHash = await argon2.hash(newPassword);
    await this.userRepository.save(user);

    this.logger.log(`✅ Contraseña actualizada exitosamente para el usuario: ${username}`);
    return { message: 'Contraseña actualizada exitosamente.' };
  }

  async updateRole(
    username: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string }> {
    const { newRole } = updateRoleDto;

    this.logger.log(`🔑 Intentando cambiar el rol del usuario: ${username} a ${newRole}`);

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      this.logger.warn(`⚠️ Usuario no encontrado: ${username}`);
      throw new NotFoundException('Usuario no encontrado.');
    }

    user.role = newRole;
    await this.userRepository.save(user);

    this.logger.log(`✅ Rol actualizado exitosamente para el usuario: ${username}`);
    return { message: 'Rol actualizado exitosamente.' };
  }
}
