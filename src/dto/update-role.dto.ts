import { IsString, IsIn } from 'class-validator';

export class UpdateRoleDto {
  @IsString({ message: 'El rol debe ser un texto válido.' })
  @IsIn(['admin', 'user'], { message: 'El rol debe ser "admin" o "user".' })
  newRole: 'admin' | 'user';
}
