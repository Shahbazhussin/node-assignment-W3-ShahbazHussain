import { Exclude } from "class-transformer";
import { Category } from "src/category/entity/category.entity";
import { Products } from "src/products/entity/products.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany((_type) => Products , product => product.user , {eager : false})
    @Exclude({toPlainOnly:true})
    products : Products[]

    @OneToMany((_type) => Category , category => category.user , {eager : false})
    @Exclude({toPlainOnly:true})
    categories: Category[]
};

