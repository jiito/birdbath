import mongoose from "mongoose";
import { Schema } from "mongoose";
interface DeleteAction {
  time: string;
  userId: mongoose.Types.ObjectId;
  totalDeleted: number;
  status: "STARTED" | "FINISHED" | "ERROR";
}

const DeleteActionSchema = new Schema<DeleteAction>({
  time: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  totalDeleted: { type: Number, required: true },
  status: { type: String, enum: ["STARTED", "FINISHED", "ERROR"] },
});

export const DeleteActionModel =
  mongoose.models.DeleteAction ||
  mongoose.model<DeleteAction>("DeleteAction", DeleteActionSchema);
