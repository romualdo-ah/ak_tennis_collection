import { ShoeSchema } from './../schemas/shoe.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ShoesService } from './shoes.service';
import { ShoesController } from './shoes.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Shoe', schema: ShoeSchema }])],
  controllers: [ShoesController],
  providers: [ShoesService],
})
export class ShoesModule {}
