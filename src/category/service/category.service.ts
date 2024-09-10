import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repository/category.repository';
import { CreateCategoryDTO } from '../DTO/create-category.dto';
import { Category } from '../entity/category.entity';
import { getUser } from 'src/user/auth/get-user.decorator';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class CategoryService {
    constructor(
        private categoryRepository : CategoryRepository
    ){}

    async createCategory(categoryDTO : CreateCategoryDTO , @getUser() user : User):Promise<Category>{
        try{
            return await this.categoryRepository.createCategory(categoryDTO , user);
        }
        catch(error){
            throw error;
        }
    }
}
