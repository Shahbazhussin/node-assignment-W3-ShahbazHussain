import { DataSource, Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { createUserDTO } from "../DTO/create-user.dto";
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async getUserByEmail(email: string): Promise<User> {
        const query = this.createQueryBuilder('User');
        query.where({ email });
        return await query.getOne();
    }

    async getUser(id: string): Promise<User> {
        try {
            const query = this.createQueryBuilder('User');
            query.where({ id });
            const user = await query.getOne();
            if (user)
                return user;
            else
                throw new NotFoundException(`User with this id not exists`);
        }
        catch (error) {
            throw error;
        }
    }
    async createUser(signupDTO: createUserDTO): Promise<User> {
        try {
            const { name, email, password } = signupDTO;
            const userExists = await this.getUserByEmail(email);
            if (!userExists) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const user = this.create({
                    name,
                    email,
                    password: hashedPassword
                });
                return await this.save(user);
            }
            else
                throw new ConflictException(`User with email already exists`);
        } catch (error) {
            throw error;
        }
    }
}