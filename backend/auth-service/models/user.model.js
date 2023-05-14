const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required!"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      validate: {
        validator: (value) => {
          return value ? /\d{10}/.test(value) : true;
        },
        message: "Invalid Mobile Number!",
      },
      trim: true,
    },
    email: {
      type: String,
      validate: {
        validator: (value) => {
          return value ? /\S+@\S+\.\S+/.test(value) : true;
        },
        message: "Invalid Email Address!",
      },
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

UserSchema.pre("save", function (next) {
  // create and update
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      throw new Error("Something went wrong!");
    }
    console.log(hash);
    this.password = hash;
    return next();
  });
});

UserSchema.methods.checkpassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, same) {
      if (err) return reject(err);

      return resolve(same);
    });
  });
};

module.exports = mongoose.model("User", UserSchema);
