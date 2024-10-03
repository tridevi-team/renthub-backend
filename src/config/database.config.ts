"use strict";

import { Model } from "objection";
import Knex from "knex";
import knexConfig from "../../knexfile";
import "dotenv/config";

// get the environment from the .env file
const environment = process.env.NODE_ENV || "development";

// Initialize knex.
const knex = Knex(knexConfig[environment]);
Model.knex(knex);

export default knex;
