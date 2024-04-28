import { model, Schema } from "mongoose";

export interface ITest extends Document {
  name: string;
}

const TestSchema: Schema = new Schema({
  name: String,
});

export default model<ITest>("Test", TestSchema);
