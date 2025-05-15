import { model, models, Schema } from "mongoose";

type PositionSchema = {
  title: string;
};

const schema = new Schema<PositionSchema>(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Position = models?.Position || model("Position", schema);
export default Position;
