import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    plan: {type: String, required: true},
    amount: {type: Number, required: true},
    credits: {type: Number, required: true},
    payment: {type: Boolean, default: false},
    date: {type: Number},
})

const transactionModel = mongoose.models.transaction || mongoose.model("transaction",
    transactionSchema)  //first it will search for model with the name transaction, if not available then it will create a new model with the name transaction using this transactionSchema

export default transactionModel;