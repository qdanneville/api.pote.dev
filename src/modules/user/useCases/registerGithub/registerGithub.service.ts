import { Injectable, BadRequestException } from '@nestjs/common';
import { LoginGithubService } from '../loginGithub/loginGithub.service';
import { RegisterGithubDTO } from './RegisterGithub.dto';
import { githubProviderService } from '../../services/authProviders/githubProvider.service';
import { User } from '../../domain/user';
import { UserEmail } from '../../domain/userEmail';
import { UserRepository } from '../../repos/user.repository';
import { UserUsername } from '../../domain/userUsername';
import { UserRole } from '../../domain/userRole';
import { RoleRepository } from '../../repos/role.repository';

@Injectable()
export class RegisterGithubService {
    constructor(
        private userRepository: UserRepository,
        private loginGithubService: LoginGithubService,
        private githubProviderService: githubProviderService,
        private roleRepository: RoleRepository
    ) { }

    async register(req: RegisterGithubDTO) {

        const { githubAccessToken, username } = req
        let user: User
        let alreadyCreatedUser;

        const githubUserInfo = await this.githubProviderService.getProfileInfo(githubAccessToken)

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

            return await this.loginGithubService.login(user)
        }
        //Register user
        else {
            const emailDomain = UserEmail.create(githubUserInfo.email)
            const usernameDomain = await UserUsername.create(username)
            const defaultUserRole = await this.roleRepository.getDefaultUserRole()
            const roleDomain = UserRole.create({ roleId: defaultUserRole.id, name: defaultUserRole.name })

            try {
                const usernameIsTaken = await this.userRepository.getUserByUserName(usernameDomain.props.value)

                if (usernameIsTaken) {
                    throw 'This username is already taken';
                }

                const userDomain: User = User.create({
                    email: emailDomain,
                    username: usernameDomain,
                    password: null,
                    role: roleDomain,
                    isEmailVerified: githubUserInfo.verified
                })

                await this.userRepository.createUser(userDomain)

                return await this.loginGithubService.login(userDomain)

            } catch (err) {
                console.log('err', err)
                throw new BadRequestException(err);
            }
        }
    }
}