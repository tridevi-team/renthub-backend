import express from "express";
import { ContractController } from "../controllers";
import { authentication, handleErrors } from "../middlewares";
import { contractValidator, houseValidator, roomsValidator } from "../middlewares/validator";

const contractRoute = express.Router();

contractRoute.get("/key-replace", ContractController.getKeys);

contractRoute.post(
    "/:houseId/create-contract-template",
    authentication,
    houseValidator.houseIdValidator,
    handleErrors,
    contractValidator.createContractTemplate,
    handleErrors,
    ContractController.createContractTemplate
);

contractRoute.post(
    "/:roomId/create-contract",
    authentication,
    roomsValidator.roomId,
    handleErrors,
    contractValidator.createRoomContract,
    handleErrors,
    ContractController.createRoomContract
);

contractRoute.get(
    "/:templateId/template-details",
    authentication,
    contractValidator.templateId,
    handleErrors,
    ContractController.getContractTemplateDetails
);

contractRoute.get(
    "/:houseId/contract-templates",
    authentication,
    houseValidator.houseIdValidator,
    handleErrors,
    ContractController.getContractTemplates
);

contractRoute.get(
    "/:roomId/contracts",
    authentication,
    roomsValidator.roomId,
    handleErrors,
    ContractController.getRoomContracts
);

contractRoute.get(
    "/:houseId/contracts-by-house",
    authentication,
    houseValidator.houseIdValidator,
    handleErrors,
    ContractController.getRoomContractsByHouse
);

contractRoute.get(
    "/:contractId/contract-details",
    authentication,
    contractValidator.contractId,
    handleErrors,
    ContractController.getRoomContractDetails
);

contractRoute.patch(
    "/:templateId/update-contract-template",
    authentication,
    contractValidator.templateId,
    handleErrors,
    contractValidator.updateContractTemplate,
    handleErrors,
    ContractController.updateContractTemplate
);

contractRoute.patch(
    "/:contractId/update-contract",
    authentication,
    contractValidator.contractId,
    handleErrors,
    contractValidator.updateRoomContract,
    handleErrors,
    ContractController.updateRoomContract
);

contractRoute.patch(
    "/:contractId/update-contract-status",
    authentication,
    contractValidator.contractId,
    handleErrors,
    contractValidator.updateContractStatus,
    handleErrors,
    ContractController.updateRoomContractStatus
);

contractRoute.delete(
    "/:templateId/delete-contract-template",
    authentication,
    contractValidator.templateId,
    handleErrors,
    ContractController.deleteContractTemplate
);

contractRoute.delete(
    "/:contractId/delete-contract",
    authentication,
    contractValidator.contractId,
    handleErrors,
    ContractController.deleteRoomContract
);

contractRoute.get(
    "/:roomId/latest-contract",
    authentication,
    roomsValidator.roomId,
    handleErrors,
    ContractController.getLatestRoomContract
);

export default contractRoute;
