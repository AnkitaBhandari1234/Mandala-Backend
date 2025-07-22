// backend/controllers/esewa.controller.js

const { EsewaPaymentGateway, EsewaCheckStatus } = require("esewajs");
const Transaction = require("../Models/transcation.model");

const EsewaInitiatePayment = async (req, res) => {
  const { amount, productId } = req.body;

  try {
    const reqPayment = await EsewaPaymentGateway(
      amount,
      0,
      0,
      0,
      productId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL,
      undefined,
      undefined
    );

    if (!reqPayment) {
      return res.status(400).json("Error sending data to eSewa");
    }

    if (reqPayment.status === 200) {
      const transaction = new Transaction({
        product_id: productId,
        amount: amount,
      });

      await transaction.save();
      console.log("Transaction saved");

      return res.send({
        url: reqPayment.request.res.responseUrl,
      });
    }
  } catch (error) {
    console.error("Esewa Init Error:", error.message);
    return res.status(500).json("Esewa Payment Init Failed");
  }
};

const paymentStatus = async (req, res) => {
  const { product_id } = req.body;

  try {
    const transaction = await Transaction.findOne({ product_id });

    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.product_id,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    if (paymentStatusCheck.status === 200) {
      transaction.status = paymentStatusCheck.data.status;
      await transaction.save();

      return res.status(200).json({
        message: "Transaction status updated successfully",
        status: transaction.status,
      });
    } else {
      return res.status(400).json({ message: "Failed to fetch payment status" });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  EsewaInitiatePayment,
  paymentStatus,
};
