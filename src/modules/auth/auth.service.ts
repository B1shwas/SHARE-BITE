import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'database/prisma.service';
import { CreateUserDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { ROLE } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signin(data: CreateUserDto) {
    const duplicate = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (duplicate) {
      throw new BadRequestException('User already exists');
    }

    if (data.role === ROLE.ADMIN) {
      throw new BadRequestException('Admins must be created by a superadmin');
    }

    let hashedPassword: string;
    hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
