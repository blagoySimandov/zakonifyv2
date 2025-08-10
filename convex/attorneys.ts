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
                .eq("location.state", args.state!),
            )
        : null;

    const byVerified =
      args.isVerified !== undefined
        ? ctx.db
            .query("attorneys")
            .withIndex("by_verified", (q) =>
              q.eq("isVerified", args.isVerified!),
            )
        : null;

    let cursor = byLocation ?? byVerified ?? ctx.db.query("attorneys");

    // If both filters are provided but we can only choose one index, add the other as a filter
    if (byLocation && args.isVerified !== undefined) {
      cursor = cursor.filter((q) =>
        q.eq(q.field("isVerified"), args.isVerified!),
      );
    }
    if (byVerified && args.city && args.state) {
      cursor = cursor.filter((q) =>
        q.and(
          q.eq(q.field("location.city"), args.city!),
          q.eq(q.field("location.state"), args.state!),
        ),
      );
    }

    const attorneys = await cursor.collect();

    let filtered = attorneys;

    if (args.practiceAreas && args.practiceAreas.length > 0) {
      filtered = attorneys.filter((attorney) =>
        args.practiceAreas!.some((area) =>
          attorney.practiceAreas.includes(area),
        ),
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
        }),
      ),
    ),
    location: v.object({
      city: v.string(),
      state: v.string(),
      country: v.string(),
      address: v.optional(v.string()),
      zipCode: v.optional(v.string()),
    }),
    languages: v.optional(v.array(v.string())),
    profileImage: v.optional(v.string()),
    profileImageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Comprehensive input validation
    if (!args.fullName || args.fullName.trim().length < 2) {
      throw new ConvexError("Full name must be at least 2 characters");
    }
    if (args.fullName.length > 100) {
      throw new ConvexError("Full name must be less than 100 characters");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new ConvexError("Please enter a valid email address");
    }

    // Bar Association ID validation
    if (!args.barAssociationId || args.barAssociationId.trim().length < 5) {
      throw new ConvexError("Bar Association ID must be at least 5 characters");
    }
    if (args.barAssociationId.length > 20) {
      throw new ConvexError(
        "Bar Association ID must be less than 20 characters",
      );
    }

    // Years of experience validation
    if (args.yearsOfExperience < 0) {
      throw new ConvexError("Years of experience cannot be negative");
    }
    if (args.yearsOfExperience > 70) {
      throw new ConvexError("Years of experience seems too high");
    }

    // Bio validation
    if (args.bio && args.bio.length > 0) {
      if (args.bio.length < 50) {
        throw new ConvexError(
          "Bio must be at least 50 characters to help clients understand your expertise",
        );
      }
      if (args.bio.length > 1000) {
        throw new ConvexError("Bio must be less than 1000 characters");
      }
    }

    // Education validation
    if (args.education && args.education.length > 0) {
      if (args.education.length < 10) {
        throw new ConvexError("Education field must be at least 10 characters");
      }
      if (args.education.length > 500) {
        throw new ConvexError(
          "Education field must be less than 500 characters",
        );
      }
    }

    // Practice areas validation
    if (!args.practiceAreas || args.practiceAreas.length === 0) {
      throw new ConvexError("Please select at least one practice area");
    }
    if (args.practiceAreas.length > 5) {
      throw new ConvexError("Please select no more than 5 practice areas");
    }

    // Hourly rate validation
    if (args.hourlyRate < 50) {
      throw new ConvexError("Hourly rate must be at least $50");
    }
    if (args.hourlyRate > 2000) {
      throw new ConvexError("Hourly rate must be less than $2000");
    }

    // Fixed fee packages validation
    if (args.fixedFeePackages) {
      for (const pkg of args.fixedFeePackages) {
        if (!pkg.name || pkg.name.length < 5) {
          throw new ConvexError("Package name must be at least 5 characters");
        }
        if (pkg.name.length > 100) {
          throw new ConvexError(
            "Package name must be less than 100 characters",
          );
        }
        if (!pkg.description || pkg.description.length < 20) {
          throw new ConvexError(
            "Package description must be at least 20 characters",
          );
        }
        if (pkg.description.length > 500) {
          throw new ConvexError(
            "Package description must be less than 500 characters",
          );
        }
        if (pkg.price < 100) {
          throw new ConvexError("Package price must be at least $100");
        }
        if (pkg.price > 50000) {
          throw new ConvexError("Package price must be less than $50,000");
        }
      }
    }

    if (!args.location.city || args.location.city.trim().length < 2) {
      throw new ConvexError("City must be at least 2 characters");
    }
    if (args.location.city.length > 50) {
      throw new ConvexError("City must be less than 50 characters");
    }
    if (!args.location.state || args.location.state.trim().length < 2) {
      throw new ConvexError("State must be at least 2 characters");
    }
    if (args.location.state.length > 50) {
      throw new ConvexError("State must be less than 50 characters");
    }
    if (!args.location.address || args.location.address.trim().length < 5) {
      throw new ConvexError("Address must be at least 5 characters");
    }
    if (args.location.address.length > 100) {
      throw new ConvexError("Address must be less than 100 characters");
    }

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
      fullName: args.fullName.trim(),
      email: args.email.toLowerCase().trim(),
      barAssociationId: args.barAssociationId.trim(),
      bio: args.bio?.trim(),
      education: args.education?.trim(),
      yearsOfExperience: args.yearsOfExperience,
      practiceAreas: args.practiceAreas,
      hourlyRate: args.hourlyRate,
      fixedFeePackages: args.fixedFeePackages,
      location: {
        city: args.location.city.trim(),
        state: args.location.state.trim(),
        country: args.location.country.trim(),
        address: args.location.address.trim(),
        zipCode: args.location.zipCode?.trim(),
      },
      languages: args.languages,
      isVerified: false, // Will be verified by admin
      profileImage: args.profileImage,
      profileImageStorageId: args.profileImageStorageId,
      createdAt: now,
      updatedAt: now,
    });

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
    profileImage: v.optional(v.string()),
    profileImageStorageId: v.optional(v.id("_storage")),
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
        }),
      ),
    ),
    location: v.optional(
      v.object({
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        country: v.optional(v.string()),
        address: v.optional(v.string()),
        zipCode: v.optional(v.string()),
      }),
    ),
    languages: v.optional(v.array(v.string())),
    profileImage: v.optional(v.string()),
    profileImageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...rawUpdates } = args;

    const processedUpdates = { ...rawUpdates };

    if (rawUpdates.location) {
      const attorney = await ctx.db.get(id);
      if (!attorney) {
        throw new ConvexError("Attorney not found");
      }

      const mergedLocation = {
        city: rawUpdates.location.city ?? attorney.location.city,
        state: rawUpdates.location.state ?? attorney.location.state,
        country: rawUpdates.location.country ?? attorney.location.country,
        address: rawUpdates.location.address ?? attorney.location.address,
        zipCode: rawUpdates.location.zipCode ?? attorney.location.zipCode,
      };

      if (
        !mergedLocation.city ||
        !mergedLocation.state ||
        !mergedLocation.country ||
        !mergedLocation.address
      ) {
        throw new ConvexError(
          "All location fields (city, state, country, address) are required",
        );
      }

      processedUpdates.location = mergedLocation;
    }

    return await ctx.db.patch(id, {
      ...processedUpdates,
      updatedAt: Date.now(),
    });
  },
});
