// backend/Controllers/esewa.controller.js
const { EsewaPaymentGateway, EsewaCheckStatus } = require("esewajs");
const Transaction = require("../Models/transcation.model");

const EsewaInitiatePayment = async (req, res) => {
  const { amount, transactionId ,userId} = req.body;

  // Basic validation
  if (!amount || !transactionId || !userId) {
    return res.status(400).json({ message: "Amount, transactionId and userId are required" });
  }

  try {
    const reqPayment = await EsewaPaymentGateway(
      amount,
      0, // tax amount
      0, // service charge
      0, // delivery charge
     transactionId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL
    );

    if (!reqPayment || reqPayment.status !== 200) {
      return res.status(400).json({ message: "Error initiating payment" });
    }

    // Save transaction in DB
    const transaction = new Transaction({
       transaction_id: transactionId,
      amount,
       user: userId,
    });

    await transaction.save();

    return res.json({ url: reqPayment.request.res.responseUrl });
  } catch (error) {
    console.error("Esewa initiate error:", error);
    return res.status(500).json({ message: "Failed to initiate payment" });
  }
};

const paymentStatus = async (req, res) => {
  const { transactionId} = req.body;

  if (!transactionId) {
    return res.status(400).json({ message: "transactionid is required" });
  }

  try {
    const transaction = await Transaction.findOne({ transaction_id: transactionId });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.transaction_id,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (paymentStatusCheck.status === 200) {
      transaction.status = paymentStatusCheck.data.status;
      await transaction.save();

      return res.status(200).json({ message: "Transaction status updated successfully" });
    } else {
      return res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  EsewaInitiatePayment,
  paymentStatus,
};
