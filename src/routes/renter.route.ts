import express from "express";
import RenterController from "../controllers/renter.controller";
import { renterValidator } from "../middlewares/validator";
import { access, handleErrors } from "../middlewares";

const renterRouter = express.Router();

// renterRouter.post("/add/:roomId", access, renterValidator.renterInfo, handleErrors, RenterController.addNewRenter);
// renterRouter.get("/list/:roomId", access, RenterController.getRenterList);
// renterRouter.get("/list/house/:houseId", access, RenterController.getRenterListByHouse);
// renterRouter.get("/details/:renterId", access, RenterController.getRenterDetails);
// renterRouter.put("/update/:renterId", access, renterValidator.renterInfo, handleErrors, RenterController.updateRenterDetails);
// renterRouter.delete("/delete/:renterId", access, RenterController.deleteRenter);

export default renterRouter;
