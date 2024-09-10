import { DataSource } from "typeorm";
import { Products } from "../entity/products.entity";
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, Scope } from "@nestjs/common";
import { ProductDTO } from "../DTO/create-product.dto";
import { getUser } from "src/user/auth/get-user.decorator";
import { User } from "src/user/entity/user.entity";
import { Category } from "src/category/entity/category.entity";
import { UUID } from "crypto";
import { BaseRepository } from "src/utils/base-repo";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
@Injectable({ scope: Scope.REQUEST })
export class ProductRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) request: Request) {
        super(dataSource, request);
    }

    async createProduct(createProductDTO: ProductDTO, @getUser() user: User, category: Category): Promise<Products> {
        try {
            const { title, description, price } = createProductDTO;
            const product = {
                title: title,
                description: description,
                price: price,
                category: category,
                user: user
            };
            const addedProduct = await this.getRepository(Products).save(product);
            if (addedProduct)
                return addedProduct;
            else
                throw new InternalServerErrorException("Error occurred during product creation");
        } catch (error) {
            throw error;
        }
    }

    async getProduct(id: UUID, @getUser() user: User): Promise<Products> {
        try {
            const product = await this.getRepository(Products).findOne({ where: { id } });
            if (product)
                return product;
            else {
                throw new NotFoundException(`Product with id : ${id} not found`);
            }
        } catch (error) {
            throw error;
        }
    }

    async getUserProducts(id: UUID, relation: string): Promise<Products[]> {
        try {

            const products = await this.getRepository(Products).find({
                where: { user: { id } },
                relations: [relation]
            });
            if (products)
                return products;
            else {
                throw new NotFoundException(`Products with User id : ${id} not found`);
            }
        } catch (error) {
            throw error;

        }
    }

    async getCategoryProducts(id: UUID, relation: string): Promise<Products[]> {
        try {
            const products = await this.getRepository(Products).find({
                where: { category: { id } },
                relations: [relation]
            });
            if (products)
                return products;
            else {
                throw new NotFoundException(`Products with Category id : ${id} not found`);
            }
        } catch (error) {
            throw new NotFoundException(`Products with Category id : ${id} not found`);
        }
    }

    async getAdminProducts(@getUser() user: User): Promise<Products[]> {
        try {
            const id = user.id;
            const products = await this.getRepository(Products).find({ where: { user: { id } } })
            if (products)
                return products;
            else {
                throw new NotFoundException(`Products with User id : ${user.id} not found`);
            }
        } catch (error) {
            throw error;
        }
    }

    async getProducts(): Promise<Products[]> {
        try {
            const products = await this.getRepository(Products).find();
            if (products)
                return products;
            else {
                throw new NotFoundException(`Not a single product found`);
            }
        } catch (error) {
            throw error;
        }
    }

    async addProductToDB(product: Products): Promise<Products> {
        try {
            const addedProduct = await this.getRepository(Products).save(product);
            if (addedProduct)
                return addedProduct;
            else
                throw new BadRequestException(`Product not saved in db`);
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(product: Products): Promise<void> {
        try {
            const deletedProduct = this.getRepository(Products).delete(product);
            if (!deletedProduct)
                throw new InternalServerErrorException(`Product can't be deleted`);
        } catch (error) {
            throw error;
        }
    }
}