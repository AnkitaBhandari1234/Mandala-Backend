// controllers/esewa.controller.js
const crypto = require("crypto");

const initEsewa = (req, res) => {
  const {
    amount, // amt
    tax_amount, // not needed separately, add in psc or pdc if any
    total_amount, // tAmt
    transaction_uuid, // pid
    product_code, // scd (merchant code)
    product_service_charge, // psc
    product_delivery_charge, // pdc
    success_url, // su
    failure_url, // fu
  } = req.body;


const secretKey = process.env.ESEWA_SECRET_KEY;

  const signed_field_names = "amt,pid,scd,tAmt,psc,pdc,su,fu";

  const message = `amt=${amount},pid=${transaction_uuid},scd=${product_code},tAmt=${total_amount},psc=${product_service_charge},pdc=${product_delivery_charge},su=${success_url},fu=${failure_url}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");

  const payload = {
    amt: amount, // amount to pay
    psc: product_service_charge || "0",
    pdc: product_delivery_charge || "0",
    tAmt: total_amount, // total amount
    pid: transaction_uuid,
    scd: product_code, // merchant code like EPAYTEST
    su: success_url,
    fu: failure_url,
     signed_field_names,
    signature,
  };

  return res.json(payload);
};

module.exports = { initEsewa };
