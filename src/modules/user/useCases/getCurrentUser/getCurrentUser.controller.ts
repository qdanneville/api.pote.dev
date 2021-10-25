import {
    Controller,
    Get,
    UseGuards,
    Request,
} from '@nestjs/common';


import { JwtAuthGuard } from '../../services/auth/guards/jwt-auth.guard';

@Controller('auth/me')
export class GetCurrentUserController {
    @Get()
    @UseGuards(JwtAuthGuard)
    me(@Request() req) {
        return req.user;
    }
}