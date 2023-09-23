import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { UserRole } from './@types';

export const UserSchema = new Schema({
  rt: {
    type: String,
    unique: false,
    required: false,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: UserRole,
    unique: false,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  confirmed: {
    type: Boolean,
    required: true,
  },
  confirmAttempts: {
    type: Number,
    required: true,
  },
  avatarPath: {
    type: String,
    required: false,
  },
  codes: {
    type: Object,
    required: false,
  },
  data: {
    type: Object,
    required: false,
  },
  productIds: {
    type: Array,
    required: false
  }
});

export const UserModel = MongooseModule.forFeature([
  { name: 'User', schema: UserSchema },
]);
