import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

export const ProductSchema = new Schema({
  identifier: {
    type: String,
    unique: true,
    required: true,
  },
  mainImageUrl: {
    type: String,
    unique: false,
    required: false,
  },
  title: {
    type: String,
    unique: true,
    required: true,
  },
  rubPrice: {
    type: String,
    unique: false,
    required: true,
  },
  description: {
    type: String,
    unique: false,
    required: false,
  },
  category: {
    type: String,
    unique: false,
    required: false,
  },
  inStockQuantity: {
    type: Number,
    unique: false,
    required: false,
  },
});

export const ProductModel = MongooseModule.forFeature([
  { name: 'Product', schema: ProductSchema },
]);
