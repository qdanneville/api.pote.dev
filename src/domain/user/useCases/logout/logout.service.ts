import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { GetUserByEmailService } from '../../useCases/getUserByEmail/getUserByEmail.service';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { UserRepository } from '../../repos/user.repository';
import { LogoutDto } from '../../dtos/logout.dto';

@Injectable()
export class LogoutService {
    constructor(
        private userRepository: UserRepository,
        private redisHandlerService: RedisHandlerService,
    ) { }

    async logout(request: LogoutDto) {

        let user;
        const { userId } = request;

        try {
            try {
                user = await this.userRepository.getUserById(userId)
            }
            catch (err) {
                return new NotFoundException('User not found')
            }

            await this.redisHandlerService.deleteUser(user.id)
        }
        catch (err) {
            return new NotImplementedException('Something went wrong, try again')
        }

        return
    }
}