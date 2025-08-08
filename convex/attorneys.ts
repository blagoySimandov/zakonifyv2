import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const getAll = query({
  args: {
    limit: v.optional(v.number()),
    practiceAreas: v.optional(v.array(v.string())),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    isVerified: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const byLocation =
      args.city && args.state
        ? ctx.db
            .query("attorneys")
            .withIndex("by_location", (q) =>
              q
                .eq("location.city", args.city!)
                .eq("location.state", args.state!)
            )
        : null;

    const byVerified =
      args.isVerified !== undefined
        ? ctx.db
            .query("attorneys")
            .withIndex("by_verified", (q) =>
              q.eq("isVerified", args.isVerified!)
            )
        : null;

    let cursor = byLocation ?? byVerified ?? ctx.db.query("attorneys");

    // If both filters are provided but we can only choose one index, add the other as a filter
    if (byLocation && args.isVerified !== undefined) {
      cursor = cursor.filter((q) =>
        q.eq(q.field("isVerified"), args.isVerified!)
      );
    }
    if (byVerified && args.city && args.state) {
      cursor = cursor.filter((q) =>
        q.and(
          q.eq(q.field("location.city"), args.city!),
          q.eq(q.field("location.state"), args.state!)
        )
      );
    }

    const attorneys = await cursor.collect();

    let filtered = attorneys;

    if (args.practiceAreas && args.practiceAreas.length > 0) {
      filtered = attorneys.filter((attorney) =>
        args.practiceAreas!.some((area) =>
          attorney.practiceAreas.includes(area)
        )
      );
    }

    return filtered.slice(0, args.limit || 50);
  },
});

export const getById = query({
  args: { id: v.id("attorneys") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Check if email is already registered
export const checkEmailExists = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("attorneys")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return existing !== null;
  },
});

// Check if bar association ID is already registered
export const checkBarIdExists = query({
  args: { barAssociationId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("attorneys")
      .filter((q) => q.eq(q.field("barAssociationId"), args.barAssociationId))
      .first();

    return existing !== null;
  },
});

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
    }),
    languages: v.optional(v.array(v.string())),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingEmail = await ctx.db
      .query("attorneys")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingEmail) {
      throw new ConvexError("An account with this email already exists");
    }

    // Check if bar association ID already exists
    const existingBarId = await ctx.db
      .query("attorneys")
      .filter((q) => q.eq(q.field("barAssociationId"), args.barAssociationId))
      .first();

    if (existingBarId) {
      throw new ConvexError("This bar association ID is already registered");
    }

    const now = Date.now();

    const attorneyId = await ctx.db.insert("attorneys", {
      ...args,
      isVerified: false, // Will be verified by admin
      createdAt: now,
      updatedAt: now,
    });

    // Create an initial matter for attorney-client if desired in future (on first consultation we create)
    return {
      success: true,
      id: attorneyId,
      message:
        "Registration successful. Your account will be verified within 24-48 hours.",
    };
  },
});

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
    }),
    languages: v.optional(v.array(v.string())),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("attorneys", {
      ...args,
      isVerified: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("attorneys"),
    fullName: v.optional(v.string()),
    email: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    barAssociationId: v.optional(v.string()),
    bio: v.optional(v.string()),
    education: v.optional(v.string()),
    yearsOfExperience: v.optional(v.number()),
    practiceAreas: v.optional(v.array(v.string())),
    hourlyRate: v.optional(v.number()),
    fixedFeePackages: v.optional(
      v.array(
        v.object({
          name: v.string(),
          description: v.string(),
          price: v.number(),
        })
      )
    ),
    location: v.optional(
      v.object({
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        country: v.optional(v.string()),
        zipCode: v.optional(v.string()),
      })
    ),
    languages: v.optional(v.array(v.string())),
    profileImage: v.optional(v.string()),
    profileImageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Handle nested location updates
    if (updates.location) {
      const attorney = await ctx.db.get(id);
      if (!attorney) {
        throw new ConvexError("Attorney not found");
      }
      
      // Merge with existing location data
      updates.location = {
        ...attorney.location,
        ...updates.location,
      };
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});
