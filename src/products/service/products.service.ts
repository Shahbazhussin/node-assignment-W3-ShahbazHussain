import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '../repository/products.repository';
import { ProductDTO } from '../DTO/create-product.dto';
import { Products } from '../entity/products.entity';
import { getUser } from 'src/user/auth/get-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { CategoryRepository } from 'src/category/repository/category.repository';
import { UUID } from 'crypto';
import { UserRepository } from 'src/user/repository/user.repository';

@Injectable()
export class ProductsService {
    constructor(
        private productRepository: ProductRepository,
        private categoryRepository: CategoryRepository,
        private userRepository: UserRepository,
    ) { }

    async createProduct(
        createProductDTO: ProductDTO,
        @getUser() user: User,
    ): Promise<Products> {
        try {
            const { categoryId } = createProductDTO;
            const category = await this.categoryRepository.getCategory(categoryId);
            if (category) {
                const product = await this.productRepository.createProduct(
                    createProductDTO,
                    user,
                    category,
                );
                if (product) {
                    if (!category.products) category.products = [];

                    category.products.push(product);
                    const added =
                        await this.categoryRepository.addProductToCategory(category);
                    if (added) return product;
                } else {
                    throw new InternalServerErrorException('Category not saved in Db');
                }
            } else throw new NotFoundException('Category not found');
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(
        id: UUID,
        updateProductDTO: ProductDTO,
        @getUser() user: User,
    ): Promise<void> {
        try {
            const { title, description, price, categoryId } = updateProductDTO;
            const product = await this.productRepository.getProduct(id, user);
            if (product) {
                const category = await this.categoryRepository.getCategory(categoryId);
                if (category) {
                    product.title = title;
                    product.description = description;
                    product.price = price;
                    product.category = category;
                    const added = this.productRepository.addProductToDB(product);
                    if (added) return;
                } else throw new NotFoundException('Category Does Not Exists');
            } else {
                throw new NotFoundException('Product Does Not Exists');
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id: UUID, @getUser() user: User): Promise<void> {
        try {
            const product = await this.productRepository.getProduct(id, user);
            if (product) {
                await this.productRepository.deleteProduct(product);
            } else {
                throw new NotFoundException(`Product with id ${id} not found`);
            }
        } catch (error) {
            throw error;
        }
    }

    async getUserProducts(id: UUID, @getUser() user: User): Promise<Products[]> {
        try {
            const userId: string = id;
            const user = await this.userRepository.getUser(userId);
            if (user) {
                const products = await this.productRepository.getUserProducts(
                    id,
                    'user',
                );
                if (products) return products;
            } else throw new NotFoundException('User Not Found');
        } catch (error) {
            throw error;
        }
    }

    async getCategoryProducts(
        id: UUID,
        @getUser() user: User,
    ): Promise<Products[]> {
        try {
            const category = await this.categoryRepository.getCategory(id);
            if (category) {
                const products = await this.productRepository.getCategoryProducts(
                    id,
                    'user',
                );
                return products;
            } else throw new NotFoundException('Category Not Found');
        } catch (error) {
            throw error;
        }
    }

    async getProduct(id: UUID, @getUser() user: User): Promise<Products> {
        try {
            const product = await this.productRepository.getProduct(id, user);
            if (product) {
                return product;
            } else {
                throw new NotFoundException(`Product with id ${id} not found`);
            }
        } catch (error) {
            throw error;
        }
    }

    async getAdminProducts(@getUser() user: User): Promise<Products[]> {
        try {
            const products = await this.productRepository.getAdminProducts(user);
            return products;
        } catch (error) {
            throw error;
        }
    }

    async getProducts(): Promise<Products[]> {
        try {
            const products = await this.productRepository.getProducts();
            return products;
        } catch (error) {
            throw error;
        }
    }
}
