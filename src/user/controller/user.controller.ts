import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { createUserDTO } from '../DTO/create-user.dto';
import { userLoginDTO } from '../DTO/login-user.dto';
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('/Signup')
    async Signup(@Body() signupDTO: createUserDTO): Promise<string> {
        try {
            const signup = await this.userService.Signup(signupDTO);
            if (signup) return 'User Successfully created';
        } catch (error) {
            throw error;
        }
    }

    @Post('/Login')
    async Login(@Body() loginDTO: userLoginDTO): Promise<{ Token: string }> {
        try {
            return await this.userService.loginUser(loginDTO);
        } catch (error) {
            throw error;
        }
    }
}
