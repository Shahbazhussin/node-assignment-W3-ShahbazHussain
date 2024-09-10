import { DataSource, Repository } from "typeorm";
import { Category } from "../entity/category.entity";
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, Scope } from "@nestjs/common";
import { CreateCategoryDTO } from "../DTO/create-category.dto";
import { getUser } from "src/user/auth/get-user.decorator";
import { User } from "src/user/entity/user.entity";
import { UUID } from "crypto";
import { BaseRepository } from "src/utils/base-repo";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
@Injectable({ scope: Scope.REQUEST })
export class CategoryRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
        super(dataSource, request);
    }

    async createCategory(categoryDTO: CreateCategoryDTO, @getUser() user: User): Promise<Category> {
        try {
            const { name } = categoryDTO;
            const category = {
                name: name,
                user: user
            }
            const repository = this.getRepository(Category);
            const addedCategory = await repository.save(category);
            if (addedCategory)
                return addedCategory;
            else throw new InternalServerErrorException('Error during category creation');
        } catch (error) {
            throw error;
        }
    }

    async getCategory(id: UUID): Promise<Category> {
        try {
            const category = await this.getRepository(Category)
                .findOne({ where: { id } });
            if (!category)
                throw new NotFoundException(`Category with id : ${id} not found`);
            else {
                return category;
            }
        } catch (error) {
            throw error;
        }
    }

    async addProductToCategory(category: Category): Promise<Category> {
        try {
            const addedCategory = await this.getRepository(Category).save(category);
            if (addedCategory)
                return addedCategory;
            else
                throw new BadRequestException(`Category not saved in db`);
        } catch (error) {
            throw error;
        }
    }
}