import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import { MeResponseDto } from '../../dto/auth/me-response.dto';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<MeResponseDto> {
    // Buscar el usuario por ID
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.isActive()) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Obtener información de la persona asociada si existe
    let names: string | undefined;
    let phone: string | undefined;
    let documentType: string | undefined;
    let documentNumber: string | undefined;
    
    if (user.personId) {
      const person = await this.userRepository.findPersonById(user.personId);
      if (person) {
        names = person.names;
        phone = person.phone?.value;
        documentType = person.document.type;
        documentNumber = person.document.number;
      }
    }

    return {
      id: user.id,
      email: user.email,
      names,
      role: user.role,
      isActive: user.isActive(),
      phone,
      documentType,
      documentNumber,
      storeId: user.storeId || undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
