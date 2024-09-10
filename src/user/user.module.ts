import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
 
  imports : [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret:'12345',
      signOptions:{
        expiresIn:300000
      }
    }),
    TypeOrmModule.forFeature([User]),

  ],
  controllers: [UserController],
  providers: [UserService , UserRepository,JwtStrategy ,{provide:'JWT_STRATEGY',useClass:JwtStrategy}],
  exports: [JwtStrategy, PassportModule]
})
export class UserModule {}
