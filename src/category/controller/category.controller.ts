import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { CreateCategoryDTO } from '../DTO/create-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from 'src/user/auth/get-user.decorator';
import { User } from 'src/user/entity/user.entity';

@Controller('category')
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    @Post('/createCategory')
    async createCategory(@Body() categoryDTO: CreateCategoryDTO, @getUser() user: User): Promise<string> {
        try {
            const category = await this.categoryService.createCategory(categoryDTO, user);
            if (category)
                return 'Category Created SuccessFully';
        } catch (error) {
            throw error;
        }
    }
}
