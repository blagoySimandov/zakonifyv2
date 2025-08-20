import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const debugAttorneyAvailability = query({
  args: {
    attorneyId: v.id("attorneys"),
  },
  handler: async (ctx, args) => {
    // Get attorney basic info
    const attorney = await ctx.db.get(args.attorneyId);
    
    // Get availability profile
    const profile = await ctx.db
      .query("attorneyAvailability")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .first();

    // Get existing consultations for the next 7 days
    const now = Date.now();
    const weekFromNow = now + 7 * 24 * 60 * 60 * 1000;
    
    const consultations = await ctx.db
      .query("consultations")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .filter((q) =>
        q.and(
          q.gte(q.field("scheduledAt"), now),
          q.lte(q.field("scheduledAt"), weekFromNow),
          q.neq(q.field("status"), "cancelled"),
        ),
      )
      .collect();

    // Get blocked periods for the next 7 days
    const blockedPeriods = await ctx.db
      .query("attorneyBlockedPeriods")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .filter((q) =>
        q.or(
          q.and(
            q.gte(q.field("startTime"), now),
            q.lte(q.field("startTime"), weekFromNow),
          ),
          q.and(
            q.gte(q.field("endTime"), now),
            q.lte(q.field("endTime"), weekFromNow),
          ),
          q.and(
            q.lte(q.field("startTime"), now),
            q.gte(q.field("endTime"), weekFromNow),
          ),
        ),
      )
      .collect();

    // Get slot reservations
    const reservations = await ctx.db
      .query("slotReservations")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .filter((q) =>
        q.and(
          q.gte(q.field("startTime"), now),
          q.lte(q.field("startTime"), weekFromNow),
          q.gt(q.field("expiresAt"), now),
        ),
      )
      .collect();

    return {
      attorney: attorney ? {
        id: attorney._id,
        name: attorney.fullName,
        hourlyRate: attorney.hourlyRate,
        isVerified: attorney.isVerified,
      } : null,
      profile: profile ? {
        id: profile._id,
        isActive: profile.isActive,
        timeZone: profile.timeZone,
        workingHours: profile.workingHours,
        consultationSettings: profile.consultationSettings,
      } : null,
      consultations: consultations.map(c => ({
        id: c._id,
        scheduledAt: new Date(c.scheduledAt).toISOString(),
        status: c.status,
        duration: c.duration,
      })),
      blockedPeriods: blockedPeriods.map(bp => ({
        id: bp._id,
        type: bp.type,
        startTime: new Date(bp.startTime).toISOString(),
        endTime: new Date(bp.endTime).toISOString(),
      })),
      reservations: reservations.map(r => ({
        id: r._id,
        startTime: new Date(r.startTime).toISOString(),
        endTime: new Date(r.endTime).toISOString(),
        expiresAt: new Date(r.expiresAt).toISOString(),
      })),
      currentTime: new Date(now).toISOString(),
      debugInfo: {
        hasAttorney: !!attorney,
        hasProfile: !!profile,
        profileIsActive: profile?.isActive,
        hasWorkingHours: !!profile?.workingHours,
        consultationCount: consultations.length,
        blockedPeriodsCount: blockedPeriods.length,
        reservationsCount: reservations.length,
      }
    };
  },
});

export const createBasicAvailabilityProfile = mutation({
  args: {
    attorneyId: v.id("attorneys"),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existing = await ctx.db
      .query("attorneyAvailability")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .first();

    if (existing) {
      return { message: "Profile already exists", profileId: existing._id };
    }

    // Create a basic availability profile
    const now = Date.now();
    const profileId = await ctx.db.insert("attorneyAvailability", {
      attorneyId: args.attorneyId,
      timeZone: "Europe/Sofia",
      workingHours: {
        monday: { start: "09:00", end: "17:00" },
        tuesday: { start: "09:00", end: "17:00" },
        wednesday: { start: "09:00", end: "17:00" },
        thursday: { start: "09:00", end: "17:00" },
        friday: { start: "09:00", end: "17:00" },
      },
      consultationSettings: {
        defaultDuration: 60,
        bufferTime: 15,
        maxConsultationsPerDay: 8,
        allowBackToBack: false,
        minAdvanceBooking: 2, // 2 hours in advance
        maxAdvanceBooking: 720, // 30 days in advance
        consultationTypes: [
          { type: "video", duration: 60, price: 150, isEnabled: true },
          { type: "in-person", duration: 60, price: 150, isEnabled: true },
        ],
      },
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return { message: "Profile created successfully", profileId };
  },
});