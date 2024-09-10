import { Module } from '@nestjs/common';
import { ProductsController } from './controller/products.controller';
import { ProductsService } from './service/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entity/products.entity';
import { ProductRepository } from './repository/products.repository';
import { UserModule } from 'src/user/user.module';
import { CategoryRepository } from 'src/category/repository/category.repository';
import { UserRepository } from 'src/user/repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products]) , UserModule],
  controllers: [ProductsController],
  providers: [ProductsService , ProductRepository , CategoryRepository, UserRepository]
})
export class ProductsModule {}
