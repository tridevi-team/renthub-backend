import express from "express";
import { IssueController } from "../controllers";
import { Action, Module } from "../enums";
import { authentication, authorize, handleErrors } from "../middlewares";
import { houseValidator, issueValidator } from "../middlewares/validator";

const issueRouter = express.Router();

issueRouter.post(
    "/:houseId/create",
    authentication,
    authorize(Module.ISSUE, Action.CREATE),
    houseValidator.houseIdValidator,
    handleErrors,
    issueValidator.issueRequest,
    handleErrors,
    IssueController.createIssue
);

issueRouter.get(
    "/:houseId/list",
    authentication,
    authorize(Module.ISSUE, Action.READ),
    issueValidator.getIssues,
    handleErrors,
    IssueController.getIssues
);

issueRouter.get(
    "/:issueId/details",
    authentication,
    authorize(Module.ISSUE, Action.READ),
    issueValidator.issueId,
    handleErrors,
    IssueController.getIssue
);

issueRouter.put(
    "/:issueId/update",
    authentication,
    authorize(Module.ISSUE, Action.UPDATE),
    issueValidator.issueId,
    handleErrors,
    issueValidator.issueRequest,
    handleErrors,
    IssueController.updateIssue
);

issueRouter.patch(
    "/:issueId/update-status",
    authentication,
    authorize(Module.ISSUE, Action.UPDATE),
    issueValidator.issueId,
    handleErrors,
    issueValidator.status,
    handleErrors,
    IssueController.updateIssueStatus
);

issueRouter.patch(
    "/:issueId/assign",
    authentication,
    authorize(Module.ISSUE, Action.UPDATE),
    issueValidator.issueId,
    handleErrors,
    issueValidator.assignee,
    handleErrors,
    IssueController.updateAssignee
);

issueRouter.delete(
    "/:issueId/delete",
    authentication,
    authorize(Module.ISSUE, Action.DELETE),
    issueValidator.issueId,
    handleErrors,
    IssueController.deleteIssue
);

export default issueRouter;
