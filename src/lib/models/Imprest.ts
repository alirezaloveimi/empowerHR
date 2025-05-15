import { model, models, ObjectId, Schema, Types } from "mongoose";

export enum Status {
  PENDING = "PENDING",
  ACCEPT = "ACCEPT",
  REJECT = "REJECT",
}

type ImprestSchema = {
  amount: number;
  message: string;
  status: Status;
  requestedAt: Date;
  employee: ObjectId;
};

const schema = new Schema<ImprestSchema>(
  {
    employee: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    requestedAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
  },
  { timestamps: true }
);

const Imprest = models?.Imprest || model("Imprest", schema);
export default Imprest;
