import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  example: defineTable({
    text: v.string(),
  }),

  matters: defineTable({
    attorneyId: v.id("attorneys"),
    clientId: v.id("clients"),
    title: v.optional(v.string()),
    lastMessageAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_attorney", ["attorneyId"])
    .index("by_client", ["clientId"])
    .index("by_attorney_client", ["attorneyId", "clientId"]),

  messages: defineTable({
    matterId: v.id("matters"),
    senderRole: v.union(v.literal("attorney"), v.literal("client")),
    senderId: v.union(v.id("attorneys"), v.id("clients")),
    content: v.string(),
    attachmentIds: v.optional(v.array(v.id("files"))),
    createdAt: v.number(),
  }).index("by_matter", ["matterId"]),

  files: defineTable({
    matterId: v.id("matters"),
    uploadedByRole: v.union(v.literal("attorney"), v.literal("client")),
    uploadedById: v.union(v.id("attorneys"), v.id("clients")),
    fileUrl: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    createdAt: v.number(),
  }).index("by_matter", ["matterId"]),

  attorneys: defineTable({
    fullName: v.string(),
    email: v.string(),
    phoneNumber: v.optional(v.string()),
    barAssociationId: v.string(),
    bio: v.optional(v.string()),
    education: v.optional(v.string()),
    yearsOfExperience: v.number(),
    practiceAreas: v.array(v.string()),
    hourlyRate: v.number(),
    fixedFeePackages: v.optional(
      v.array(
        v.object({
          name: v.string(),
          description: v.string(),
          price: v.number(),
        })
      )
    ),
    location: v.object({
      city: v.string(),
      state: v.string(),
      country: v.string(),
      zipCode: v.optional(v.string()),
    }),
    languages: v.optional(v.array(v.string())),
    isVerified: v.boolean(),
    profileImage: v.optional(v.string()),
    profileImageStorageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_practice_areas", ["practiceAreas"])
    .index("by_location", ["location.city", "location.state"])
    .index("by_verified", ["isVerified"]),

  clients: defineTable({
    fullName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  consultations: defineTable({
    attorneyId: v.id("attorneys"),
    clientId: v.id("clients"),
    matterId: v.optional(v.id("matters")),
    scheduledAt: v.number(),
    duration: v.number(),
    price: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_attorney", ["attorneyId"])
    .index("by_client", ["clientId"])
    .index("by_scheduled_date", ["scheduledAt"]),

  reviews: defineTable({
    attorneyId: v.id("attorneys"),
    clientName: v.string(),
    clientEmail: v.string(),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_attorney", ["attorneyId"])
    .index("by_client_email", ["clientEmail"]),
});
