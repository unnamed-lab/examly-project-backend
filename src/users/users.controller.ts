import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CustomRequest } from 'types';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile info' })
  getProfile(@Req() req: CustomRequest) {
    if (!req.user?.userId) throw new NotFoundException();
    return this.userService.findById(+req.user?.userId);
  }

  @Get()
  async findByEmail(@Body(ValidationPipe) payload: { email: string }) {
    if (!payload.email) throw new BadRequestException();
    return this.userService.findByEmail(payload.email);
  }

  @Get(':id')
  async findById(@Query() id: number) {
    if (!id) throw new BadRequestException();
    return this.userService.findById(id);
  }
}
