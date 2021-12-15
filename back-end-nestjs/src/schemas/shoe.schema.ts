import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShoeDocument = Shoe & Document;

@Schema()
export class Shoe {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop()
  price: number;

  @Prop()
  imageUrl: string;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop()
  size: string;
}

export const ShoeSchema = SchemaFactory.createForClass(Shoe);
