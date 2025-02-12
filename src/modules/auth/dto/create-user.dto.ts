import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'bishwash@sharebite.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(7, 25)
  password: string;

  @ApiProperty({
    example: 'Bishwash',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'DONOR',
    enum: ROLE,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;
}
