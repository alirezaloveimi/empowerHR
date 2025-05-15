import { model, models, ObjectId, Schema } from "mongoose";

enum Role {
  HR = "HR",
  EMPLOYEE = "EMPLOYEE",
}

type ImageSchma = {
  url: string;
  path: string;
};

type UserSchema = {
  fullname: string;
  username: string;
  password: string;
  monthlyLimit: number;
  image: ImageSchma;
  role: Role;
  position: ObjectId;
};

const imageSchma = new Schema<ImageSchma>({
  url: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
});

const schema = new Schema<UserSchema>(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    monthlyLimit: {
      type: Number,
      default: 5_000_000,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.EMPLOYEE,
    },
    position: {
      type: Schema.Types.ObjectId,
      ref: "Position",
      required: true,
    },
    image: {
      type: imageSchma,
      required: true,
    },
  },
  { timestamps: true }
);

const User = models?.User || model<UserSchema>("User", schema);
export default User;
