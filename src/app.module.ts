import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Services from './application/services';
import * as Controllers from './controllers';

@Module({
  imports: [],
  controllers: [AppController, ...Object.values(Controllers)],
  providers: [AppService, ...Object.values(Services)],
})
export class AppModule {}
