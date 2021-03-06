import mongoose, { Model , Document, HookNextFunction} from "mongoose";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator"
interface User extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken: string[];
}

const { Schema, model } = mongoose;

const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    refreshToken: { type: [String], required: true, default: [] },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(uniqueValidator)

UserSchema.pre("save", async function (this: User, next: HookNextFunction) {
  // before saving the user in the database, hash the password
  const newUser = this;
  const plainPW = newUser.password;

  if (newUser.isModified("password")) {
    const hash = await bcrypt.hash(plainPW, 10);
    newUser.password = hash;
  }

  next();
});

UserSchema.methods.toJSON = function () {
  // called automatically every time express sends the users response res.send(users)
  const userDocument = this;
  const userObject = userDocument.toObject();
  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

UserSchema.statics.checkCredentials = async function (email: string, plainPW: string) {
  const user = await this.findOne({ email }); // find the user by email, using this in a normal function to target the schema in this file

  if (user) {
    const isMatch = await bcrypt.compare(plainPW, user.password);
    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

interface UserModel extends Model<User > {
  checkCredentials: (email: string, password: string) => Promise<User | null>;
}

export default model<User, UserModel>("User", UserSchema);
