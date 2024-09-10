import { DataSource, EntityManager, Repository } from "typeorm";
import { Entity_Manager_Key } from "./transaction.interceptor";
import { Request } from "express";
export class BaseRepository{
    constructor(private dataSource: DataSource , private request : Request){}
    protected getRepository<T>(entityclass : new ()=> T): Repository<T>{
        const entityManager : EntityManager = this.request[Entity_Manager_Key]?? this.dataSource.manager;
        return entityManager.getRepository(entityclass);
    }

}