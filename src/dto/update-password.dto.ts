import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'La contraseña actual debe ser un texto válido.' })
  currentPassword: string;

  @IsString({ message: 'La nueva contraseña debe ser un texto válido.' })
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres.' })
  newPassword: string;
}
