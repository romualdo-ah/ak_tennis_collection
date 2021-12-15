import { Shoe, ShoeDocument } from './../schemas/shoe.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateShoeDto } from './dto/create-shoe.dto';
import { UpdateShoeDto } from './dto/update-shoe.dto';
import { Model } from 'mongoose';

@Injectable()
export class ShoesService {
  constructor(@InjectModel(Shoe.name) private shoeModel: Model<ShoeDocument>) {}

  async create(createShoeDto: CreateShoeDto) {
    return new this.shoeModel(createShoeDto).save();
  }

  async findAll() {
    return await this.shoeModel.find();
  }

  async findOne(sku: string) {
    //find one by his sku
    return await this.shoeModel.findOne({ sku: sku });
  }

  async update(sku: string, updateShoeDto: UpdateShoeDto) {
    return await this.shoeModel.findOneAndUpdate({ sku: sku }, updateShoeDto, {
      new: true,
    });
  }

  async remove(sku: string) {
    return this.shoeModel.findOneAndDelete({ sku: sku });
  }

  async removeAll() {
    return this.shoeModel.deleteMany({});
  }
}
