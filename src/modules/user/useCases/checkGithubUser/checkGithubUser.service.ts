import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisHandlerService } from '../../services/auth/redis/redis-handler.service';
import { JwtHandlerService } from '../../services/auth/jwt/jwt-handler.service';

import { UserEmail } from '../../domain/userEmail';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../repos/user.repository';
import { LoginGithubService } from '../loginGithub/loginGithub.service';
import { RedisAuthService } from '../../services/auth/redisAuth.service';
import { githubProviderService } from '../../services/authProviders/githubProvider.service';
import { CheckGithubUserDTO } from './checkGithubUser.dto';
import { User } from '../../domain/user';

@Injectable()
export class CheckGithubUserService {
    constructor(
        private loginGithubService: LoginGithubService,
        private userRepository: UserRepository,
        private githubProviderService: githubProviderService
    ) { }

    async check(req: CheckGithubUserDTO) {

        const { code } = req
        let user: User
        let alreadyCreatedUser;

        const gitHubaccessToken = await this.githubProviderService.getAccessToken(code)

        const githubUserInfo = await this.githubProviderService.getProfileInfo(gitHubaccessToken)

        const emailDomain = UserEmail.create(githubUserInfo.email)

        try {
            alreadyCreatedUser = await this.userRepository.getUserByEmail(emailDomain)
        }
        catch (err) {
            console.log('err', err)
        }

        //Log user
        if (alreadyCreatedUser) {
            user = alreadyCreatedUser

            return { data: await this.loginGithubService.login(user), status: 'login' };
        }
        //Pré-register user
        else {
            const data = {
                username: githubUserInfo.username,
            }

            return { data, status: 'register' }
        }


        // catch (err) {
        //     console.log('err', err)
        //     throw new BadRequestException(err.message)
        // }
    }

    // const userExists = await this.userRepository.exists(userEmail)
    //TODO refacto this
    //         const userExists = false

    //         if (userExists) {
    //             const emailDomain = UserEmail.create(userEmail)
    //             const user = await this.userRepository.getUserByEmail(emailDomain);

    //             return { data: await this.loginGithubService.login(user), status: 'login' };
    //         } else {
    //             const user = {
    //                 username,
    //                 email: userEmail,
    //                 confirmed,
    //                 formToken: null
    //             }

    //             const tokenPayload = { email: user.email, confirmed: user.confirmed };
    //             const tokenSecret = process.env.JWT_OAUTH_SECRET

    //             const oauthToken = await this.jwtHandlerService.createJWT(
    //                 tokenPayload,
    //                 tokenSecret
    //             )

    //             const key = process.env.JWT_OAUTH_TOKEN_PREFIX + oauthToken

    //             await this.redisHandlerService.client.set(
    //                 key,
    //                 user.email,
    //             )

    //             user.formToken = oauthToken

    //             return { data: user, status: 'register' }
    //         }
    //     }
    //     catch (err) {
    //         throw new BadRequestException(err.message)
    //     }
    // }
}