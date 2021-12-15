import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShoesModule } from './shoes/shoes.module';

@Module({
  imports: [
    ShoesModule,
    MongooseModule.forRoot('mongodb://localhost:27017/shoenest'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
