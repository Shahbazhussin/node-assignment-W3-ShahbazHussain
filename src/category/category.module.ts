import { Module } from '@nestjs/common';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CategoryRepository } from './repository/category.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports : [
    TypeOrmModule.forFeature([Category]),
    UserModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService , CategoryRepository]
})
export class CategoryModule {}
