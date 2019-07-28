exports.up = async (knex) => {
  if (!await knex.schema.hasTable('users_groups')) {
    return knex.schema.createTable('users_groups', (table) => {
      table.bigInteger('user_id').unsigned()
      table.bigInteger('group_id')
      table.boolean('trusted').default(0)
      table.json('config')
      table.timestamps(['created_at'])

      table.primary(['user_id', 'group_id'], 'users_in_groups')
      table.foreign('user_id').references('id').inTable('users')
      table.foreign('group_id').references('id').inTable('groups')
    })
  }
  return null
}

exports.down = async (knex) => {
  if (await knex.schema.hasTable('users_groups')) {
    return knex.schema.dropTable('users_groups')
  }
  return null
}
