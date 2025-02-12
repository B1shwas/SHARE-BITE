import { Controller } from '@nestjs/common';
import { PrismaService } from 'database/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}
}
