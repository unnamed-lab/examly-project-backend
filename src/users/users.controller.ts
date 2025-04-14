import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  async findByEmail(@Body(ValidationPipe) payload: { email: string }) {
    if (!payload.email) throw new BadRequestException();
    return this.userService.findByEmail(payload.email);
  }
}
