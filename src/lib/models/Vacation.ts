import { model, models, Schema, Types } from "mongoose";
import { Status } from "./Imprest";

type VacationSchema = {
  employee: User;
  requestDate: Date;
  message: string;
  reason: string;
  status: Status;
};

const schema = new Schema<VacationSchema>(
  {
    message: {
      type: String,
      required: false,
    },
    reason: {
      type: String,
      required: false,
    },
    requestDate: {
      type: Date,
      required: true,
    },
    employee: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
  },
  { timestamps: true }
);

const Vacation = models?.Vacation || model<VacationSchema>("Vacation", schema);
export default Vacation;
