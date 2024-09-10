import { Category } from "src/category/entity/category.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Products {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    price: number

    @ManyToOne((_type) => User , user => user.products , {onDelete:'CASCADE'})
    user : User

    @ManyToOne((_type) => Category , category => category.products)
    category : Category

}