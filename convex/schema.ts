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
        }),
      ),
    ),
    location: v.object({
      city: v.string(),
      state: v.string(),
      country: v.string(),
      address: v.string(),
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
      v.literal("cancelled"),
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

  attorneyAvailability: defineTable({
    attorneyId: v.id("attorneys"),
    timeZone: v.string(),
    workingHours: v.object({
      monday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.optional(
            v.array(
              v.object({
                start: v.string(),
                end: v.string(),
              }),
            ),
          ),
        }),
      ),
      tuesday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.optional(
            v.array(
              v.object({
                start: v.string(),
                end: v.string(),
              }),
            ),
          ),
        }),
      ),
      wednesday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.optional(
            v.array(
              v.object({
                start: v.string(),
                end: v.string(),
              }),
            ),
          ),
        }),
      ),
      thursday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.optional(
            v.array(
              v.object({
                start: v.string(),
                end: v.string(),
              }),
            ),
          ),
        }),
      ),
      friday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.optional(
            v.array(
              v.object({
                start: v.string(),
                end: v.string(),
              }),
            ),
          ),
        }),
      ),
      saturday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.optional(
            v.array(
              v.object({
                start: v.string(),
                end: v.string(),
              }),
            ),
          ),
        }),
      ),
      sunday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.optional(
            v.array(
              v.object({
                start: v.string(),
                end: v.string(),
              }),
            ),
          ),
        }),
      ),
    }),
    consultationSettings: v.object({
      defaultDuration: v.number(),
      bufferTime: v.number(),
      maxConsultationsPerDay: v.number(),
      allowBackToBack: v.boolean(),
      minAdvanceBooking: v.number(),
      maxAdvanceBooking: v.number(),
      consultationTypes: v.array(
        v.object({
          type: v.union(
            v.literal("phone"),
            v.literal("video"),
            v.literal("in-person"),
          ),
          duration: v.number(),
          price: v.number(),
          isEnabled: v.boolean(),
        }),
      ),
    }),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_attorney", ["attorneyId"]),

  attorneyTimeOff: defineTable({
    attorneyId: v.id("attorneys"),
    startTime: v.number(),
    endTime: v.number(),
    type: v.union(
      v.literal("vacation"),
      v.literal("holiday"),
      v.literal("sick"),
      v.literal("unavailable"),
      v.literal("court"),
      v.literal("continuing-education"),
    ),
    isRecurring: v.boolean(),
    recurringPattern: v.optional(
      v.object({
        frequency: v.union(
          v.literal("weekly"),
          v.literal("monthly"),
          v.literal("yearly"),
        ),
        interval: v.number(),
        endDate: v.optional(v.number()),
        daysOfWeek: v.optional(v.array(v.number())),
      }),
    ),
    title: v.optional(v.string()),
    reason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_attorney", ["attorneyId"])
    .index("by_attorney_date_range", ["attorneyId", "startTime", "endTime"])
    .index("by_type", ["type"]),

  availabilitySlots: defineTable({
    attorneyId: v.id("attorneys"),
    date: v.string(),
    slots: v.array(
      v.object({
        startTime: v.number(),
        endTime: v.number(),
        consultationType: v.union(
          v.literal("phone"),
          v.literal("video"),
          v.literal("in-person"),
        ),
        price: v.number(),
        isEmergencySlot: v.boolean(),
      }),
    ),
    lastCalculated: v.number(),
    expiresAt: v.number(),
  })
    .index("by_attorney", ["attorneyId"])
    .index("by_attorney_date", ["attorneyId", "date"])
    .index("by_expires", ["expiresAt"]),

  slotReservations: defineTable({
    attorneyId: v.id("attorneys"),
    clientId: v.optional(v.id("clients")),
    startTime: v.number(),
    endTime: v.number(),
    consultationType: v.union(
      v.literal("phone"),
      v.literal("video"),
      v.literal("in-person"),
    ),
    reservedBy: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_attorney", ["attorneyId"])
    .index("by_attorney_time", ["attorneyId", "startTime"])
    .index("by_expires", ["expiresAt"])
    .index("by_reserved_by", ["reservedBy"]),
});
