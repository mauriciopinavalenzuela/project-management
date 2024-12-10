import { IsString, IsEmail, IsOptional, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  @IsString({ message: 'El nombre de usuario debe ser un texto.' })
  username: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido.' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @IsOptional()
  @IsIn(['user', 'admin'], { message: 'El rol debe ser "user" o "admin".' })
  role?: 'user' | 'admin';
}
