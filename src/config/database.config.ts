"use strict";

import { Model } from "objection";
import Knex from "knex";
import knexConfig from "../../knexfile";

// Initialize knex.
const knex = Knex(knexConfig.development);
Model.knex(knex);

export default knex;
