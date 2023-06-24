import {
    Controller,
    Get,
    UseGuards,
    Request,
} from '@nestjs/common';
import { GetUserByEmailDTO } from '../getUserByEmail/getUserByEmail.dto';
import { JwtAuthGuard } from '../../services/auth/guards/jwt-auth.guard';
import { GetUserByEmailService } from '../getUserByEmail/getUserByEmail.service';
import { UserMap } from '../../mappers/userMap';
import { userResponseDTO } from '../../dtos/user.dto';

@Controller('auth/me')
export class GetCurrentUserController {
    constructor(private readonly getUserByEmailService: GetUserByEmailService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async me(@Request() req): Promise<userResponseDTO> {
        return UserMap.toResponse(await this.getUserByEmailService.find(req.user as GetUserByEmailDTO))
    }
}

