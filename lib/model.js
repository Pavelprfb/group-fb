import mongoose from "mongoose";

const LoginDataSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  favorite: { type: Boolean, default: false },
  source: { type: String, default: "web" },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.LoginData || mongoose.model("LoginData", LoginDataSchema);
