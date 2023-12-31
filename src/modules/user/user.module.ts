import { Module } from '@nestjs/common';

//Auth modules
import { PassportModule } from '@nestjs/passport';
import { JwtHandlerModule } from './services/auth/jwt/jwt-handler.module';
import { RedisHandlerModule } from './services/auth/redis/redis-handler.module';

//Core auth logic
import { RedisAuthModule } from './services/auth/redisAuth.module';

//Strategies
import { JwtStrategy } from './services/auth/strategies/jwt.strategy';

//Guards
import { RolesGuard } from './services/auth/guards/roles.guard';
import { ConfirmedGuard } from './services/auth/guards/confirmed.guard';

//UseCases
//Auth
import { CreateUserModule } from './useCases/createUser/createUser.module'
import { SendVerifyEmailModule } from './useCases/sendVerifyEmail/sendVerifyEmail.module';
import { VerifyEmailModule } from './useCases/verifyEmail/verifyEmail.module';
import { LoginModule } from './useCases/login/login.module';
import { LogoutModule } from './useCases/logout/logout.module';
import { GetCurrentUserModule } from './useCases/getCurrentUser/getCurrentUser.module'
import { ForgotPasswordModule } from './useCases/forgotPassword/forgotPassword.module';
import { ResetPasswordModule } from './useCases/resetPassword/resetPassword.module';
import { RefreshAccessTokenModule } from './useCases/refreshAccessToken/refreshAccessToken.module';

//Oauth
import { CheckGithubUserModule } from './useCases/checkGithubUser/checkGithubUser.module';
import { RegisterGithubModule } from './useCases/registerGithub/registerGithub.module';
// import { LoginGithubModule } from './useCases/loginGithub/loginGithub.module';

//User
import { GetUserByEmailModule } from './useCases/getUserByEmail/getUserByEmail.module'
import { GetUsersModule } from './useCases/getUsers/getUsers.module'

//Repo
import { UserRepository } from './repos/user.repository';
import { RoleRepository } from './repos/role.repository';

@Module({
  imports: [
    PassportModule,
    RedisHandlerModule,
    JwtHandlerModule,
    RedisAuthModule,
    CreateUserModule,
    VerifyEmailModule,
    SendVerifyEmailModule,
    LoginModule,
    CheckGithubUserModule,
    RegisterGithubModule,
    LogoutModule,
    GetCurrentUserModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    GetUserByEmailModule,
    GetUsersModule,
    RefreshAccessTokenModule,
  ],
  providers: [JwtStrategy, RolesGuard, UserRepository, RoleRepository, ConfirmedGuard],
})

export class UsersModule { }