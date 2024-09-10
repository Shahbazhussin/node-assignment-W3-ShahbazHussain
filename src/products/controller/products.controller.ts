import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from '../service/products.service';
import { ProductDTO } from '../DTO/create-product.dto';
import { getUser } from 'src/user/auth/get-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { UUID } from 'crypto';
import { Products } from '../entity/products.entity';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
    constructor(private productService: ProductsService) { }
    @Post('/createProduct')
    async createProduct(
        @Body() createProductDTO: ProductDTO,
        @getUser() user: User,
    ): Promise<string> {
        try {
            await this.productService.createProduct(createProductDTO, user);
            return 'Product Created Successfully';
        } catch (error) {
            throw error;
        }
    }

    @Put('/updateProduct/:id')
    async updateProduct(
        @Param('id') id: UUID,
        @Body() updateProductDTO: ProductDTO,
        @getUser() user: User,
    ): Promise<string> {
        try {
            await this.productService.updateProduct(id, updateProductDTO, user);
            return 'Product Successfully Updated';
        } catch (error) {
            throw error;
        }
    }

    @Delete('/deleteProduct/:id')
    async deleteProduct(
        @Param('id') id: UUID,
        @getUser() user: User,
    ): Promise<string> {
        try {
            await this.productService.deleteProduct(id, user);
            return 'Product Successfully Deleted';
        } catch (error) {
            throw error;
        }
    }

    @Get('/user/:id')
    async getUserProducts(
        @Param('id') id: UUID,
        @getUser() user: User,
    ): Promise<Products[]> {
        try {
            const products = await this.productService.getUserProducts(id, user);
            return products;
        } catch (error) {
            throw error;
        }
    }

    @Get('/admin')
    async getAdminProducts(@getUser() user: User): Promise<Products[]> {
        try {
            const products = await this.productService.getAdminProducts(user);
            return products;
        } catch (error) {
            throw error;
        }
    }

    @Get('/category/:id')
    async getCategoryProducts(
        @Param('id') id: UUID,
        @getUser() user: User,
    ): Promise<Products[]> {
        try {
            const products = await this.productService.getCategoryProducts(id, user);
            return products;
        } catch (error) {
            throw error;
        }
    }

    @Get('/product/:id')
    async getProduct(
        @Param('id') id: UUID,
        @getUser() user: User,
    ): Promise<Products> {
        try {
            const product = await this.productService.getProduct(id, user);
            return product;
        } catch (error) {
            throw error;
        }
    }

    @Get('/products')
    async getProducts(): Promise<Products[]> {
        try {
            const products = await this.productService.getProducts();
            return products;
        } catch (error) {
            throw error;
        }
    }
}
