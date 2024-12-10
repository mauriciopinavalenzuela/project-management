import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class LoginUserDto {
  @ValidateIf((o) => !o.username) // Valida solo si no se proporciona el username
  @IsString({ message: 'El email debe ser un string.' })
  @IsOptional()
  email?: string;

  @ValidateIf((o) => !o.email) // Valida solo si no se proporciona el email
  @IsString({ message: 'El username debe ser un string.' })
  @IsOptional()
  username?: string;

  @IsString({ message: 'La contraseña debe ser un string.' })
  password: string;
}
