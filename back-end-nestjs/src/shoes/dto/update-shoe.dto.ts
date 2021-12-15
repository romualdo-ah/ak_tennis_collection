import { PartialType } from '@nestjs/mapped-types';
import { CreateShoeDto } from './create-shoe.dto';

export class UpdateShoeDto extends PartialType(CreateShoeDto) {}
