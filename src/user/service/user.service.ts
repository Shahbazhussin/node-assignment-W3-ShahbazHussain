import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { createUserDTO } from '../DTO/create-user.dto';
import { userLoginDTO } from '../DTO/login-user.dto';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../auth/payload.interface';
@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }

    async Signup(signupDTO: createUserDTO): Promise<User> {
        try {
            const user = await this.userRepository.createUser(signupDTO);
            if (user)
                return user;
            else
                throw new InternalServerErrorException('User Cannot be created');
        } catch (error) {
            throw error;
        }
    }

    async loginUser(loginDTO: userLoginDTO): Promise<{ Token: string }> {
        try {
            const { email, password } = loginDTO;
            const userExists = await this.userRepository.getUserByEmail(email);
            if (userExists) {
                if (await bcrypt.compare(password, userExists.password)) {
                    const id = userExists.id;
                    const payload: Payload = { id, email };
                    const Token: string = this.jwtService.sign(payload);
                    return { Token };
                }
                else {
                    throw new BadRequestException('Credentials not matched');
                }
            }
            else {
                throw new NotFoundException('User Not found')
            }
        }
        catch (error) {
            throw error;
        }
    }
}
