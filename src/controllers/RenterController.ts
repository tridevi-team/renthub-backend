"use strict";

import { Renters } from "../models";
import { ApiException, Exception, formatJson } from "../utils";

const RenterController = {
    async addNewRenter(req, res) {
        try {
            const {
                roomId,
            }: {
                roomId: Number;
            } = req.params;
            const user = req.user;

            const { name, citizenId, phoneNumber, email, licensePlates, temporaryRegistration, moveInDate, represent } = req.body;
            console.log({
                name: name,
                citizen_id: citizenId,
                phone_number: phoneNumber,
                email: email || null,
                license_plates: licensePlates,
                temporary_registration: temporaryRegistration,
                move_in_date: moveInDate,
                represent: represent || false,
                room_id: Number(roomId),
                created_by: user.id,
            });

            const renter = await Renters.query().insert({
                name: name,
                citizen_id: citizenId,
                phone_number: phoneNumber,
                email: email || null,
                license_plates: licensePlates,
                temporary_registration: temporaryRegistration,
                move_in_date: moveInDate,
                represent: represent || false,
                room_id: Number(roomId),
                created_by: user.id,
            });

            if (!renter) {
                throw new ApiException(1001, "Failed to add renter");
            }

            return res.json(formatJson.success(1002, "Renter added successfully", renter));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getRenterList(req, res) {
        try {
            const { roomId } = req.params;

            const renters = await Renters.query().where("room_id", roomId);

            return res.json(formatJson.success(1003, "Renter list retrieved successfully", renters));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getRenterListByHouse(req, res) {
        try {
            const { houseId } = req.params;

            const renters = await Renters.query().whereExists(function () {
                this.select("*").from("rooms").whereRaw("rooms.id = renters.room_id").where("house_id", houseId);
            });

            return res.json(formatJson.success(1003, "Renter list retrieved successfully", renters));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getRenterDetails(req, res) {
        try {
            const { renterId } = req.params;

            const renter = await Renters.query().findById(renterId);

            if (!renter) {
                throw new ApiException(1004, "Renter not found");
            }

            return res.json(formatJson.success(1005, "Renter details retrieved successfully", renter));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async updateRenterDetails(req, res) {
        try {
            const { renterId } = req.params;
            const user = req.user;

            const { name, citizenId, phoneNumber, email, licensePlates, temporaryRegistration, moveInDate, represent } = req.body;

            const renter = await Renters.query().findById(renterId);

            if (!renter) {
                throw new ApiException(1004, "Renter not found");
            }

            const updatedRenter = await renter.$query().patchAndFetch({
                name,
                citizen_id: citizenId,
                phone_number: phoneNumber,
                email: email || null,
                license_plates: licensePlates,
                temporary_registration: temporaryRegistration,
                move_in_date: moveInDate,
                represent: represent || false,
            });

            return res.json(formatJson.success(1006, "Renter details updated successfully", updatedRenter));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async deleteRenter(req, res) {
        try {
            const { renterId } = req.params;

            const renter = await Renters.query().findById(renterId);

            if (!renter) {
                throw new ApiException(1004, "Renter not found");
            }

            const deletedRenter = await renter.$query().delete();

            return res.json(formatJson.success(1007, "Renter deleted successfully", deletedRenter));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },
};

export default RenterController;
