"use strict";

import "dotenv/config";
import Knex from "knex";
import { Model } from "objection";
import knexConfig from "../../knexfile";

// get the environment from the .env file
const environment = process.env.NODE_ENV || "development";

// Initialize knex.
const knex = Knex(knexConfig[environment]);
Model.knex(knex);

export default knex;
