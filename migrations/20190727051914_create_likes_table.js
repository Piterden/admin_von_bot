exports.up = async (knex) => {
  if (!await knex.schema.hasTable('likes')) {
    return knex.schema.createTable('likes', (table) => {
      table.bigInteger('chat_id')
      table.bigInteger('message_id').unsigned()
      table.bigInteger('to_id').unsigned()
      table.bigInteger('from_id').unsigned()
      table.integer('value')
      table.json('message')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())

      table.primary(['chat_id', 'message_id', 'to_id', 'from_id']).unique()
    })
  }
  return null
}

exports.down = async (knex) => {
  if (await knex.schema.hasTable('likes')) {
    return knex.schema.dropTable('likes')
  }
  return null
}
