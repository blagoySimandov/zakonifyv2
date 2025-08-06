import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  attorneys: defineTable({
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
    languages: v.array(v.string()),
    isVerified: v.boolean(),
    profileImage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_practice_areas', ['practiceAreas'])
    .index('by_location', ['location.city', 'location.state'])
    .index('by_verified', ['isVerified']),

  clients: defineTable({
    fullName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_email', ['email']),

  consultations: defineTable({
    attorneyId: v.id('attorneys'),
    clientId: v.id('clients'),
    scheduledAt: v.number(),
    duration: v.number(),
    price: v.number(),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('completed'),
      v.literal('cancelled')
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_attorney', ['attorneyId'])
    .index('by_client', ['clientId'])
    .index('by_scheduled_date', ['scheduledAt']),

  reviews: defineTable({
    attorneyId: v.id('attorneys'),
    clientName: v.string(),
    clientEmail: v.string(),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_attorney', ['attorneyId'])
    .index('by_client_email', ['clientEmail']),
})