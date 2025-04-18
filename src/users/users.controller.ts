import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CustomRequest } from 'types';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from 'src/roles/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile info' })
  getProfile(@Req() req: CustomRequest) {
    if (!req.user?.userId) throw new NotFoundException();
    return this.userService.findById(+req.user?.userId);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findByEmail(@Body(ValidationPipe) payload: { email: string }) {
    if (!payload.email) throw new BadRequestException();
    return this.userService.findByEmail(payload.email);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findById(@Query() id: number) {
    if (!id) throw new BadRequestException();
    return this.userService.findById(id);
  }

  @Post(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async setRole(@Query() id: number, @Body() rolePayload: { role: Role }) {
    if (!id) throw new BadRequestException();
    return this.userService.setRole(id, rolePayload.role);
  }
}
