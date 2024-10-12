import express from "express"
import { Bills } from "../models";
import { aesEncrypt } from "../utils";

const staticRouter = express.Router()

staticRouter.get("/lookup", (_req, res) => {
    res.render("lookup", {
        invoice: null,
        error: null,
    });
});

staticRouter.get("/payment-success", (_req, res) => {
    res.render("paymentSuccess");
});

staticRouter.get("/getInvoice", async (req, res) => {
    const { invoiceId } = req.query;

    try {
        const result = await Bills.query()
            .findById(String(invoiceId))
            .withGraphJoined("[room.renters(represent), details]");

        if (!result) {
            return res.render("lookup", {
                invoice: null,
                error: `Không tìm thấy hóa đơn với mã: ${invoiceId}`,
            });
        }
        return res.render("lookup", {
            invoice: result,
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

export default staticRouter