import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from 'src/roles/role.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException();
    return user;
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async setRole(id: number, role: Role) {
    return this.prisma.user.update({
      where: { id },
      data: {
        role,
      },
    });
  }
}
