import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "../repository/user.repository";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Payload } from "./payload.interface";
import { User } from "../entity/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private userRepository: UserRepository
    ) {
    console.log('inside strategy extractiuon');

        super(
            {
                
                secretOrKey: '12345',
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
            }
        )
        console.log('Token', ExtractJwt.fromAuthHeaderAsBearerToken())
    }

    async validate(payload: Payload): Promise<User> {
        const { id } = payload;
        const user = await this.userRepository.getUser(id);
        if (!user)
            throw new UnauthorizedException();
        return user;
   }
}