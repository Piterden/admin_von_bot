exports.up = async (knex) => {
  if (!await knex.schema.hasTable('actions')) {
    return knex.schema.createTable('actions', table => {
      table.bigInteger('chat_id')
      table.bigInteger('user_id').unsigned()
      table.string('action', 50)
      table.string('button', 255)
      table.timestamp('created_at').defaultTo(knex.fn.now())
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
