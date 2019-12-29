/**
 * Garbage Byte model in Database
 */
import mongoose, { Document, Schema } from "mongoose";
import {
  comparePassword,
  preSaveHashPassword,
  preUpdateHashPassword
} from "./dbHelpers";

/**
 * Interface for the garbage byte
 */
export interface IGb extends Document {
  username: string; // Name of Gb
  password: string; // Password of Gb
  statusCode: number; // Last known status of Gb
  location: string; // Current location
  createdAt: string; // When Created
  updatedAt: string; // When updated
  version: string; // Software version of Gb
  videoLink: string; // Link to rtsp video stream
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create the schema
export const gbSchema: Schema = new Schema<any>(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    statusCode: Number,
    location: String,
    version: String,
    videoLink: String
  },
  { timestamps: true }
);

preSaveHashPassword(gbSchema);
preUpdateHashPassword(gbSchema);
comparePassword(gbSchema);

export const model = mongoose.model<IGb>("gb", gbSchema);

export const cleanCollectionOfTestGbs = () => model.deleteMany({}).exec(); // For testing

export default model;
