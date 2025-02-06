// import { type } from "express/lib/response.js";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    id: {
      type: String
    },
    title: {
      type: String
    },
    price: {
      type: Number
    },
    description: {
      type: String
    },
    category: {
      type: String
    },
    sold: {
      type: Number
    },
    dateOfSale: {
      type: Date
    },
    isSold : {
      type : Boolean
    }
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
