import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UnAuthorizedAccess } from "../errors/customApiError";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    validate: {
      validator: async function (value) {
        const existingUser = await this.constructor.findOne({
          email: value,
          deleted: false,
        });
        return !existingUser;
      },
    },
    message: (props) => `An account with email ${props.value} already exists.`,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "phone is required"],
    trim: true,
    length: 10,
    // match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
  },

  country: {
    type: String,
    required: [true, "country is required"],
    trim: true,
  },
  state: {
    type: String,
    required: [true, "city is required"],
    trim: true,
  },
  city: { type: String, required: [true, "city is required"], trim: true },
  streetAddress: {
    type: String,
    required: [true, "streetAddress is required"],
    trim: true,
  },
  zip: {
    type: String,
    required: [true, "zip is required"],
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  adminGrantingUserId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,

  deleted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("isAdmin")) {
    const existingAdmin = await this.constructor.findOne({
      isAdmin: true,
      _id: { $ne: this._id },
    });

    // If there is an existing admin, deny the change
    if (existingAdmin) {
      throw new UnAuthorizedAccess(
        "Only the existing admin can grant admin status."
      );
    }
    // If there is no existing admin, update the adminGrantingUserId
    if (!existingAdmin && this.isAdmin) {
      this.adminGrantingUserId = this._id;
    }
  }
  if (this.isModified("password")) {
    try {
      const hashedPassword = await hashPassword(this.password);
      if (hashedPassword) {
        this.password = hashedPassword;
        next();
      } else {
        next(new Error("Could not hash password"));
      }
    } catch (error) {
      // Handle the error, e.g., log it or pass it to the next middleware.
      next(error);
    }
  } else {
    next();
  }
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    try {
      // Call the function to hash the password
      update.password = await hashPassword(update.password);
      next();
    } catch (error) {
      return next(new Error("Could not hash password"));
    }
  } else {
    // If no password change, move to the next middleware
    return next();
  }
});

userSchema.methods.comparePassword = async function (password) {
  const isCorrect = await bcrypt.compare(password, this.password);
  return isCorrect;
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

export default mongoose.model("User", userSchema);
