exports.up = async (knex) => {
  if (!await knex.schema.hasTable('users')) {
    return knex.schema.createTable('users', (table) => {
      table.bigInteger('id').unique()
      table.string('first_name', 255)
      table.string('last_name', 255)
      table.string('username', 255).unique()
      table.boolean('is_bot')
      table.string('language_code', 2)
      table.timestamps(['created_at', 'updated_at'])

      table.primary('id')
    })
  }
  return null
}

exports.down = async (knex) => {
  if (await knex.schema.hasTable('users')) {
    return knex.schema.dropTable('users')
  }
  return null
}
