import { Module } from '@nestjs/common';
import { MongodbAdapter } from './adapter/driven/database/mongodb';
import { MysqlAdapter } from './adapter/driven/database/mysql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Controllers from './application/controllers';
import * as Repositories from './application/domain/repositories';
import * as Services from './application/services';

@Module({
  imports: [],
  controllers: [AppController, ...Object.values(Controllers)],
  providers: [
    AppService,
    {
      provide: 'DatabaseRepository',
      useFactory: async () => {
        const adapter =
          process.env.DB_ADAPTER === 'mysql'
            ? new MysqlAdapter()
            : new MongodbAdapter();
        await adapter.initialize();
        return adapter;
      },
    },
    ...Object.values(Repositories),
    ...Object.values(Services),
  ],
})
export class AppModule {}
