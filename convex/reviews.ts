import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { ConvexError } from 'convex/values'

export const getByAttorneyId = query({
  args: { attorneyId: v.id('attorneys') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('reviews')
      .withIndex('by_attorney', (q) => q.eq('attorneyId', args.attorneyId))
      .order('desc')
      .collect()
  },
})

export const getAverageRating = query({
  args: { attorneyId: v.id('attorneys') },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query('reviews')
      .withIndex('by_attorney', (q) => q.eq('attorneyId', args.attorneyId))
      .collect()
    
    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 }
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    }
  },
})

export const create = mutation({
  args: {
    attorneyId: v.id('attorneys'),
    clientName: v.string(),
    clientEmail: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.rating < 1 || args.rating > 5) {
      throw new ConvexError('Rating must be between 1 and 5')
    }

    if (args.comment.length < 10) {
      throw new ConvexError('Comment must be at least 10 characters long')
    }

    if (args.comment.length > 1000) {
      throw new ConvexError('Comment must be less than 1000 characters')
    }

    const attorney = await ctx.db.get(args.attorneyId)
    if (!attorney) {
      throw new ConvexError('Attorney not found')
    }

    const now = Date.now()
    
    const reviewId = await ctx.db.insert('reviews', {
      attorneyId: args.attorneyId,
      clientName: args.clientName,
      clientEmail: args.clientEmail,
      rating: args.rating,
      comment: args.comment,
      createdAt: now,
      updatedAt: now,
    })

    return {
      success: true,
      id: reviewId,
      message: 'Review submitted successfully',
    }
  },
})

export const update = mutation({
  args: {
    id: v.id('reviews'),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args

    if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
      throw new ConvexError('Rating must be between 1 and 5')
    }

    if (updates.comment && updates.comment.length < 10) {
      throw new ConvexError('Comment must be at least 10 characters long')
    }

    if (updates.comment && updates.comment.length > 1000) {
      throw new ConvexError('Comment must be less than 1000 characters')
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    })
  },
})

export const remove = mutation({
  args: { id: v.id('reviews') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return { success: true, message: 'Review deleted successfully' }
  },
})