import { Exclude } from "class-transformer";
import { Products } from "src/products/entity/products.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne((_type) => User , user => user.categories)
    user : User 

    @OneToMany((_type) => Products , product => product.category, {eager:true})
    products : Products[]
}