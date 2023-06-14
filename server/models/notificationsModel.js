const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    onClick: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    read : {
        type : Boolean,
        default : false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("notifications", notificationSchema);
