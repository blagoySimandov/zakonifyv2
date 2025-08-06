import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { ConvexError } from 'convex/values'

export const getAll = query({
  args: {
    limit: v.optional(v.number()),
    practiceAreas: v.optional(v.array(v.string())),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    isVerified: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query('attorneys')

    if (args.isVerified !== undefined) {
      query = query.withIndex('by_verified', (q) => q.eq('isVerified', args.isVerified))
    }

    if (args.city && args.state) {
      query = query.withIndex('by_location', (q) => 
        q.eq('location.city', args.city).eq('location.state', args.state)
      )
    }

    const attorneys = await query.collect()

    let filtered = attorneys

    if (args.practiceAreas && args.practiceAreas.length > 0) {
      filtered = attorneys.filter(attorney =>
        args.practiceAreas!.some(area => attorney.practiceAreas.includes(area))
      )
    }

    return filtered.slice(0, args.limit || 50)
  },
})

export const getById = query({
  args: { id: v.id('attorneys') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// Check if email is already registered
export const checkEmailExists = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('attorneys')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first()
    
    return existing !== null
  },
})

// Check if bar association ID is already registered
export const checkBarIdExists = query({
  args: { barAssociationId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('attorneys')
      .filter((q) => q.eq(q.field('barAssociationId'), args.barAssociationId))
      .first()
    
    return existing !== null
  },
})

// Register a new attorney
export const register = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    barAssociationId: v.string(),
    bio: v.optional(v.string()),
    education: v.optional(v.string()),
    yearsOfExperience: v.number(),
    practiceAreas: v.array(v.string()),
    hourlyRate: v.number(),
    fixedFeePackages: v.optional(v.array(v.object({
      name: v.string(),
      description: v.string(),
      price: v.number(),
    }))),
    location: v.object({
      city: v.string(),
      state: v.string(),
      country: v.string(),
    }),
    languages: v.optional(v.array(v.string())),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingEmail = await ctx.db
      .query('attorneys')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first()
    
    if (existingEmail) {
      throw new ConvexError('An account with this email already exists')
    }

    // Check if bar association ID already exists
    const existingBarId = await ctx.db
      .query('attorneys')
      .filter((q) => q.eq(q.field('barAssociationId'), args.barAssociationId))
      .first()
    
    if (existingBarId) {
      throw new ConvexError('This bar association ID is already registered')
    }

    const now = Date.now()
    
    const attorneyId = await ctx.db.insert('attorneys', {
      ...args,
      isVerified: false, // Will be verified by admin
      createdAt: now,
      updatedAt: now,
    })

    return {
      success: true,
      id: attorneyId,
      message: 'Registration successful. Your account will be verified within 24-48 hours.',
    }
  },
})

export const create = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    barAssociationId: v.string(),
    bio: v.optional(v.string()),
    education: v.optional(v.string()),
    yearsOfExperience: v.number(),
    practiceAreas: v.array(v.string()),
    hourlyRate: v.number(),
    fixedFeePackages: v.optional(v.array(v.object({
      name: v.string(),
      description: v.string(),
      price: v.number(),
    }))),
    location: v.object({
      city: v.string(),
      state: v.string(),
      country: v.string(),
    }),
    languages: v.optional(v.array(v.string())),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    
    return await ctx.db.insert('attorneys', {
      ...args,
      isVerified: false,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('attorneys'),
    fullName: v.optional(v.string()),
    bio: v.optional(v.string()),
    education: v.optional(v.string()),
    yearsOfExperience: v.optional(v.number()),
    practiceAreas: v.optional(v.array(v.string())),
    hourlyRate: v.optional(v.number()),
    fixedFeePackages: v.optional(v.array(v.object({
      name: v.string(),
      description: v.string(),
      price: v.number(),
    }))),
    location: v.optional(v.object({
      city: v.string(),
      state: v.string(),
      country: v.string(),
    })),
    languages: v.optional(v.array(v.string())),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    })
  },
})