import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('example').collect()
  },
})

export const create = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const newTaskId = await ctx.db.insert('example', { text: args.text })
    return newTaskId
  },
})