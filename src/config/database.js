const Knex = require("knex");
const knexConfig = require("./knexfile");

const { Model } = require("objection");

// Initialize knex.
const knex = Knex(knexConfig.development);
Model.knex(knex);

module.exports = knex;