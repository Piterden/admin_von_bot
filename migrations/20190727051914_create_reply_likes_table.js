exports.up = async (knex) => {
  if (!await knex.schema.hasTable('reply_likes')) {
    return knex.schema.createTable('reply_likes', (table) => {
      table.bigInteger('chat_id')
      table.bigInteger('message_id')
      table.string('text', 255)
      table.string('username', 255).unique()
      table.integer('like_count')
      table.integer('dislike_count')
      table.timestamps(['created_at', 'updated_at'])

      table.index('username')
    })
  }
  return null
}

exports.down = async (knex) => {
  if (await knex.schema.hasTable('reply_likes')) {
    return knex.schema.dropTable('reply_likes')
  }
  return null
}
