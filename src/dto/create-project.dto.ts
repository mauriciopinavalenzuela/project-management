import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @IsString({ message: 'El nombre del proyecto debe ser un string' })
  @IsNotEmpty({ message: 'El nombre del proyecto no puede estar vacío' })
  name: string;

  @IsOptional()
  @IsString({ message: 'La descripción del proyecto debe ser un string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'El usuario debe ser un string válido' })
  user?: string;
}
