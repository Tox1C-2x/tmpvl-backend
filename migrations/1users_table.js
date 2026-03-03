exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("employee_id").unique();
    table.string("full_name");
    table.string("email").unique();
    table.string("mobile");
    table.string("password_hash");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};