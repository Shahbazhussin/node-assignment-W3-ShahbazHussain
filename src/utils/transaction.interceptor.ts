import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError, concatMap, finalize, Observable, from } from "rxjs";
import { DataSource } from "typeorm";

export const Entity_Manager_Key = 'ENTITY_MANAGER';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private dataSource: DataSource) { console.log('Interceptor') }
    async intercept(ctx: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const request = ctx.switchToHttp().getRequest<Request>();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        request[Entity_Manager_Key] = queryRunner.manager;
        return next.handle().pipe(
            concatMap(async data => {
                await queryRunner.commitTransaction();
                return data;
            }),
            catchError(async e => {
                await queryRunner.rollbackTransaction();
                throw e;
            }),

            finalize(async () => {
                try {
                    await queryRunner.release();
                } catch (releaseError) {
                    console.error('Error releasing query runner:', releaseError);
                }
            })

        );
    }
}