import PayOS from "@payos/node";
import { CheckoutRequestType } from "@payos/node/lib/type";
import "dotenv/config";
import express from "express";
import { Bills } from "../models";
import { BillService } from "../services";
import { aesEncrypt } from "../utils";

const { RETURN_URL, CANCEL_URL } = process.env;

const staticRouter = express.Router();

staticRouter.get("/lookup", (_req, res) => {
    res.render("lookup", {
        invoice: null,
        error: null,
    });
});

staticRouter.get("/payment-success", (_req, res) => {
    res.render("paymentSuccess");
});

staticRouter.get("/payment-cancel", (_req, res) => {
    res.render("paymentCancel");
});

staticRouter.get("/getInvoice", async (req, res) => {
    const { invoiceId } = req.query;

    try {
        const result = await Bills.query()
            .findById(String(invoiceId))
            .withGraphJoined("[room.renters(represent), details, payment]");

        let paymentUrl = "";

        if (result && result.payment.payosClientId) {
            const payos = new PayOS(
                result.payment.payosClientId,
                result.payment.payosApiKey,
                result.payment.payosChecksum
            );
            const parsedRequest = JSON.parse(result.payosRequest);
            // const cancel = await payos.cancelPaymentLink(parsedRequest.order_code);
            // console.log("🚀 ~ staticRouter.get ~ cancel:", cancel);
            try {
                const payosResponse = await payos.getPaymentLinkInformation(parsedRequest.order_code);
                console.log("🚀 ~ staticRouter.get ~ payosResponse:", payosResponse);
                if (payosResponse.status === "CANCELLED") throw new Error("Payment was cancelled");
                paymentUrl = payosResponse.id;
            } catch (error) {
                // gen new order code
                const orderCode = Math.floor(Math.random() * 1000000000);
                await BillService.updateInfo(String(invoiceId), {
                    payosRequest: {
                        ...parsedRequest,
                        order_code: orderCode,
                    },
                });
                const checkoutRequest: CheckoutRequestType = {
                    orderCode: orderCode,
                    // amount: 5000 || parsedRequest.amount,
                    amount: 5000,
                    description: parsedRequest.description || "Thanh toán hóa đơn",
                    // items: parsedRequest.items,
                    cancelUrl: parsedRequest.cancel_url || CANCEL_URL,
                    returnUrl: parsedRequest.return_url || RETURN_URL,
                    // expiredAt: parsedRequest.expired_at,
                    // Add other necessary properties here
                };
                const data = await payos.createPaymentLink(checkoutRequest);
                paymentUrl = data.checkoutUrl;
            }
        }

        if (!result) {
            return res.render("lookup", {
                invoice: null,
                error: `Không tìm thấy hóa đơn với mã: ${invoiceId}`,
            });
        }
        return res.render("lookup", {
            invoice: result,
            paymentUrl,
            error: null,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Có lỗi xảy ra trong quá trình truy vấn.");
    }
});

staticRouter.use("/encrypt", (req, res) => {
    return res.json({
        raw: req.query.raw,
        encrypted: aesEncrypt(req.query.raw),
    });
});

export default staticRouter;
