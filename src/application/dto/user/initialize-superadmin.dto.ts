import { OmitType } from '@nestjs/swagger';
import { CreateUserWithPersonDto } from './create-user-with-person.dto';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class InitializeSuperadminDto extends OmitType(CreateUserWithPersonDto, ['storeId'] as const) {
  @IsEnum(UserRole, { message: 'El rol debe ser un valor válido' })
  role: UserRole;

  @IsOptional()
  storeId?: string;
}
