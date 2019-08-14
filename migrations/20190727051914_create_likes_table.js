exports.up = async (knex) => {
  if (!await knex.schema.hasTable('likes')) {
    return knex.schema.createTable('likes', (table) => {
      table.bigInteger('chat_id')
      table.bigInteger('message_id').unsigned()
      table.bigInteger('user_id').unsigned()
      table.integer('likes').unsigned()
      table.integer('dislikes').unsigned()
      table.json('message')
      table.timestamps(true, true)

      table.primary(['chat_id', 'message_id'])
      table.index('likes')
      table.index('dislikes')
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
