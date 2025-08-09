import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

const isTimeInRange = (time: number, start: string, end: string): boolean => {
  const timeInMinutes = timeToMinutes(minutesToTime(time / 60));
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  return timeInMinutes >= startMinutes && timeInMinutes < endMinutes;
};

const getDayOfWeek = (timestamp: number): string => {
  const date = new Date(timestamp);
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[date.getDay()];
};

export const createOrUpdateAvailabilityProfile = mutation({
  args: {
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
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existing = await ctx.db
      .query("attorneyAvailability")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .first();

    const now = Date.now();

    const profileData = {
      attorneyId: args.attorneyId,
      timeZone: args.timeZone,
      workingHours: args.workingHours,
      consultationSettings: args.consultationSettings,
      isActive: args.isActive ?? true,
      updatedAt: now,
    };

    if (existing) {
      // Update existing profile
      return await ctx.db.patch(existing._id, profileData);
    } else {
      // Create new profile
      return await ctx.db.insert("attorneyAvailability", {
        ...profileData,
        createdAt: now,
      });
    }
  },
});

// Get basic attorney availability profile
export const getBasicAvailabilityProfile = query({
  args: { attorneyId: v.id("attorneys") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attorneyAvailability")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .first();
  },
});

// Add time off period
export const addTimeOff = mutation({
  args: {
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
    isRecurring: v.optional(v.boolean()),
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("attorneyTimeOff", {
      ...args,
      isRecurring: args.isRecurring ?? false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get attorney time off periods
export const getTimeOff = query({
  args: {
    attorneyId: v.id("attorneys"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("attorneyTimeOff")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId));

    if (args.startDate && args.endDate) {
      query = ctx.db
        .query("attorneyTimeOff")
        .withIndex("by_attorney_date_range", (q) =>
          q
            .eq("attorneyId", args.attorneyId)
            .gte("startTime", args.startDate!)
            .lte("endTime", args.endDate!),
        );
    }

    return await query.collect();
  },
});

// Calculate availability for a date range
export const calculateAvailability = query({
  args: {
    attorneyId: v.id("attorneys"),
    startDate: v.number(),
    endDate: v.number(),
    consultationType: v.optional(
      v.union(v.literal("phone"), v.literal("video"), v.literal("in-person")),
    ),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get attorney availability profile
    const profile = await ctx.db
      .query("attorneyAvailability")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .first();

    if (!profile || !profile.isActive) {
      return { slots: [], totalCount: 0, calculatedAt: Date.now() };
    }

    // Get existing consultations in the date range
    const consultations = await ctx.db
      .query("consultations")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .filter((q) =>
        q.and(
          q.gte(q.field("scheduledAt"), args.startDate),
          q.lte(q.field("scheduledAt"), args.endDate),
          q.neq(q.field("status"), "cancelled"),
        ),
      )
      .collect();

    // Get time off periods in the date range
    const timeOffPeriods = await ctx.db
      .query("attorneyTimeOff")
      .withIndex("by_attorney_date_range", (q) =>
        q.eq("attorneyId", args.attorneyId),
      )
      .filter((q) =>
        q.or(
          q.and(
            q.gte(q.field("startTime"), args.startDate),
            q.lte(q.field("startTime"), args.endDate),
          ),
          q.and(
            q.gte(q.field("endTime"), args.startDate),
            q.lte(q.field("endTime"), args.endDate),
          ),
          q.and(
            q.lte(q.field("startTime"), args.startDate),
            q.gte(q.field("endTime"), args.endDate),
          ),
        ),
      )
      .collect();

    // Get active slot reservations
    const reservations = await ctx.db
      .query("slotReservations")
      .withIndex("by_attorney_time", (q) => q.eq("attorneyId", args.attorneyId))
      .filter((q) =>
        q.and(
          q.gte(q.field("startTime"), args.startDate),
          q.lte(q.field("startTime"), args.endDate),
          q.gt(q.field("expiresAt"), Date.now()),
        ),
      )
      .collect();

    // Generate available slots
    const availableSlots = [];
    const slotDuration =
      args.duration || profile.consultationSettings.defaultDuration;
    const bufferTime = profile.consultationSettings.allowBackToBack
      ? 0
      : profile.consultationSettings.bufferTime;
    const currentTime = Date.now();
    const minAdvanceTime =
      currentTime +
      profile.consultationSettings.minAdvanceBooking * 60 * 60 * 1000;

    // Iterate through each day in the range
    for (
      let date = new Date(args.startDate);
      date <= new Date(args.endDate);
      date.setDate(date.getDate() + 1)
    ) {
      const dayOfWeek = getDayOfWeek(
        date.getTime(),
      ) as keyof typeof profile.workingHours;
      const daySchedule = profile.workingHours[dayOfWeek];

      if (!daySchedule) continue; // No working hours for this day

      // Check if this day has any time off
      const hasTimeOff = timeOffPeriods.some((timeOff) => {
        const timeOffStart = new Date(timeOff.startTime);
        const timeOffEnd = new Date(timeOff.endTime);
        return date >= timeOffStart && date <= timeOffEnd;
      });

      if (hasTimeOff) continue; // Skip this day if attorney has time off

      // Generate time slots for this day
      const dayStart = new Date(date);
      const [startHour, startMinute] = daySchedule.start.split(":").map(Number);
      dayStart.setHours(startHour, startMinute, 0, 0);

      const dayEnd = new Date(date);
      const [endHour, endMinute] = daySchedule.end.split(":").map(Number);
      dayEnd.setHours(endHour, endMinute, 0, 0);

      // Generate slots with the specified duration and buffer
      for (
        let slotStart = dayStart.getTime();
        slotStart + slotDuration * 60 * 1000 <= dayEnd.getTime();
        slotStart += (slotDuration + bufferTime) * 60 * 1000
      ) {
        const slotEnd = slotStart + slotDuration * 60 * 1000;

        // Check if slot is in the future (meets minimum advance booking)
        if (slotStart < minAdvanceTime) continue;

        // Check if slot conflicts with breaks
        const conflictsWithBreak = daySchedule.breaks?.some((breakPeriod) => {
          const breakStart = new Date(date);
          const [breakStartHour, breakStartMinute] = breakPeriod.start
            .split(":")
            .map(Number);
          breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

          const breakEnd = new Date(date);
          const [breakEndHour, breakEndMinute] = breakPeriod.end
            .split(":")
            .map(Number);
          breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);

          return (
            slotStart < breakEnd.getTime() && slotEnd > breakStart.getTime()
          );
        });

        if (conflictsWithBreak) continue;

        // Check if slot conflicts with existing consultations
        const conflictsWithConsultation = consultations.some((consultation) => {
          const consultationEnd =
            consultation.scheduledAt + consultation.duration * 60 * 1000;
          return (
            slotStart < consultationEnd && slotEnd > consultation.scheduledAt
          );
        });

        if (conflictsWithConsultation) continue;

        // Check if slot conflicts with reservations
        const conflictsWithReservation = reservations.some((reservation) => {
          return (
            slotStart < reservation.endTime && slotEnd > reservation.startTime
          );
        });

        if (conflictsWithReservation) continue;

        // Find appropriate consultation type and price
        const consultationType = args.consultationType || "video";
        const consultationTypeConfig =
          profile.consultationSettings.consultationTypes.find(
            (ct) => ct.type === consultationType && ct.isEnabled,
          );

        if (!consultationTypeConfig) continue;

        // Add the available slot
        availableSlots.push({
          startTime: slotStart,
          endTime: slotEnd,
          consultationType: consultationType,
          price: consultationTypeConfig.price,
          isEmergencySlot: false,
        });
      }
    }

    return {
      slots: availableSlots.sort((a, b) => a.startTime - b.startTime),
      totalCount: availableSlots.length,
      nextAvailable: availableSlots.length > 0 ? availableSlots[0] : undefined,
      calculatedAt: Date.now(),
      expiresAt: Date.now() + 60 * 60 * 1000, // Expires in 1 hour
    };
  },
});

// Reserve a time slot temporarily
export const reserveSlot = mutation({
  args: {
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
    durationMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expirationTime = now + (args.durationMinutes || 5) * 60 * 1000; // Default 5 minutes

    // Check if slot is already reserved or booked
    const existingReservations = await ctx.db
      .query("slotReservations")
      .withIndex("by_attorney_time", (q) => q.eq("attorneyId", args.attorneyId))
      .filter((q) =>
        q.and(
          q.lt(q.field("startTime"), args.endTime),
          q.gt(q.field("endTime"), args.startTime),
          q.gt(q.field("expiresAt"), now),
        ),
      )
      .collect();

    if (existingReservations.length > 0) {
      throw new Error("Slot is already reserved");
    }

    // Check if slot conflicts with existing consultations
    const existingConsultations = await ctx.db
      .query("consultations")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .filter((q) =>
        q.and(
          q.neq(q.field("status"), "cancelled"),
          q.lt(q.field("scheduledAt"), args.endTime),
          q.gt(
            q.add(q.field("scheduledAt"), q.mul(q.field("duration"), 60000)),
            args.startTime,
          ),
        ),
      )
      .collect();

    if (existingConsultations.length > 0) {
      throw new Error("Slot conflicts with existing consultation");
    }

    return await ctx.db.insert("slotReservations", {
      attorneyId: args.attorneyId,
      clientId: args.clientId,
      startTime: args.startTime,
      endTime: args.endTime,
      consultationType: args.consultationType,
      reservedBy: args.reservedBy,
      expiresAt: expirationTime,
      createdAt: now,
    });
  },
});

// Release a reserved slot
export const releaseSlot = mutation({
  args: {
    reservationId: v.id("slotReservations"),
    reservedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.reservationId);

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    if (reservation.reservedBy !== args.reservedBy) {
      throw new Error("Unauthorized to release this reservation");
    }

    await ctx.db.delete(args.reservationId);
  },
});

// Clean up expired reservations (called periodically)
export const cleanupExpiredReservations = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredReservations = await ctx.db
      .query("slotReservations")
      .withIndex("by_expires", (q) => q.lt("expiresAt", now))
      .collect();

    for (const reservation of expiredReservations) {
      await ctx.db.delete(reservation._id);
    }

    return { deletedCount: expiredReservations.length };
  },
});

// Get next available slot for an attorney
export const getNextAvailableSlot = query({
  args: {
    attorneyId: v.id("attorneys"),
    consultationType: v.optional(
      v.union(v.literal("phone"), v.literal("video"), v.literal("in-person")),
    ),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const endDate = now + 7 * 24 * 60 * 60 * 1000; // Look ahead 7 days

    const availability = await calculateAvailability(ctx, {
      attorneyId: args.attorneyId,
      startDate: now,
      endDate: endDate,
      consultationType: args.consultationType,
      duration: args.duration,
    });

    return availability.nextAvailable;
  },
});

// Cache availability for a specific date
export const cacheAvailabilityForDate = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + 60 * 60 * 1000; // Cache for 1 hour

    // Check if cache entry exists
    const existing = await ctx.db
      .query("availabilitySlots")
      .withIndex("by_attorney_date", (q) =>
        q.eq("attorneyId", args.attorneyId).eq("date", args.date),
      )
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        slots: args.slots,
        lastCalculated: now,
        expiresAt: expiresAt,
      });
    } else {
      return await ctx.db.insert("availabilitySlots", {
        attorneyId: args.attorneyId,
        date: args.date,
        slots: args.slots,
        lastCalculated: now,
        expiresAt: expiresAt,
      });
    }
  },
});

// Get cached availability for a date
export const getCachedAvailability = query({
  args: {
    attorneyId: v.id("attorneys"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const cached = await ctx.db
      .query("availabilitySlots")
      .withIndex("by_attorney_date", (q) =>
        q.eq("attorneyId", args.attorneyId).eq("date", args.date),
      )
      .first();

    // Return cached data if it's still valid
    if (cached && cached.expiresAt > now) {
      return cached;
    }

    return null;
  },
});

// Get attorney's availability profile
export const getAvailabilityProfile = query({
  args: {
    attorneyId: v.id("attorneys"),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("attorneyAvailability")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .first();

    if (!profile) {
      // Return default profile structure if none exists
      return {
        id: null,
        attorneyId: args.attorneyId,
        timeZone: "UTC",
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
          minAdvanceBooking: 24,
          maxAdvanceBooking: 30,
          consultationTypes: [
            { type: "video", duration: 60, price: 200, isEnabled: true },
            { type: "phone", duration: 30, price: 150, isEnabled: true },
            { type: "in-person", duration: 90, price: 300, isEnabled: true },
          ],
        },
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    return profile;
  },
});

// Update attorney's availability status (online/offline)
export const updateAvailabilityStatus = mutation({
  args: {
    attorneyId: v.id("attorneys"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if profile exists
    let profile = await ctx.db
      .query("attorneyAvailability")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .first();

    if (profile) {
      // Update existing profile
      await ctx.db.patch(profile._id, {
        isActive: args.isActive,
        updatedAt: Date.now(),
      });
    } else {
      // Create new profile with default settings
      await ctx.db.insert("attorneyAvailability", {
        attorneyId: args.attorneyId,
        timeZone: "UTC",
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
          minAdvanceBooking: 24,
          maxAdvanceBooking: 30,
          consultationTypes: [
            { type: "video", duration: 60, price: 200, isEnabled: true },
            { type: "phone", duration: 30, price: 150, isEnabled: true },
            { type: "in-person", duration: 90, price: 300, isEnabled: true },
          ],
        },
        isActive: args.isActive,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { success: true, isActive: args.isActive };
  },
});
