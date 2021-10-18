import { Module } from '@nestjs/common';

//Auth modules
import { PassportModule } from '@nestjs/passport';
import { JwtHandlerModule } from './services/auth/jwt/jwt-handler.module';
import { RedisHandlerModule } from './services/auth/redis/redis-handler.module';

//Strategies
import { JwtStrategy } from './services/auth/strategies/jwt.strategy';

//Guards
import { RolesGuard } from './services/auth/guards/roles.guard';
import { ConfirmedGuard } from './services/auth/guards/confirmed.guard';

//UseCases
//Auth
import { CreateUserModule } from './useCases/createUser/createUser.module'
import { ConfirmEmailModule } from './useCases/confirmEmail/confirmEmail.module';
import { LoginModule } from './useCases/login/login.module';
import { GetCurrentUserModule } from './useCases/getCurrentUser/getCurrentUser.module'
import { ForgotPasswordModule } from './useCases/forgotPassword/forgotPassword.module';
import { ResetPasswordModule } from './useCases/resetPassword/resetPassword.module';
import { RefreshAccessTokenModule } from './useCases/refreshAccessToken/refreshAccessToken.module';

//User
import { GetUserByEmailModule } from './useCases/getUserByEmail/getUserByEmail.module'
import { GetUsersModule } from './useCases/getUsers/getUsers.module'

//Repo
import { UserRepository } from './repos/user.repository';

@Module({

  imports: [
    PassportModule,
    RedisHandlerModule,
    JwtHandlerModule,
    CreateUserModule,
    ConfirmEmailModule,
    LoginModule,
    GetCurrentUserModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    GetUserByEmailModule,
    GetUsersModule,
    RefreshAccessTokenModule
  ],
  providers: [JwtStrategy, RolesGuard, UserRepository, ConfirmedGuard],
})

export class UsersModule { }