import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const getByAttorneyId = query({
  args: {
    attorneyId: v.id("attorneys"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("consultations")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId));

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    return await query.order("desc").collect();
  },
});

export const getUpcomingConsultations = query({
  args: {
    attorneyId: v.id("attorneys"),
    days: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const days = args.days || 30;
    const limit = args.limit || 10;
    const endTime = now + days * 24 * 60 * 60 * 1000;

    const consultations = await ctx.db
      .query("consultations")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .filter((q) =>
        q.and(
          q.gte(q.field("scheduledAt"), now),
          q.lte(q.field("scheduledAt"), endTime),
          q.or(
            q.eq(q.field("status"), "pending"),
            q.eq(q.field("status"), "confirmed"),
          ),
        ),
      )
      .order("asc")
      .take(limit);
    return consultations;
  },
});

export const getAvailableSlots = query({
  args: {
    attorneyId: v.id("attorneys"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("getAvailableSlots called with:", {
      attorneyId: args.attorneyId,
      date: args.date,
    });

    const selectedDate = new Date(args.date);
    const startOfDay = selectedDate.setHours(0, 0, 0, 0);
    const endOfDay = selectedDate.setHours(23, 59, 59, 999);

    console.log("Date parsing:", {
      inputDate: args.date,
      selectedDate: selectedDate.toISOString(),
      startOfDay: new Date(startOfDay).toISOString(),
      endOfDay: new Date(endOfDay).toISOString(),
      startOfDayTimestamp: startOfDay,
      endOfDayTimestamp: endOfDay,
    });

    const existingConsultations = await ctx.db
      .query("consultations")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .filter((q) =>
        q.and(
          q.gte(q.field("scheduledAt"), startOfDay),
          q.lte(q.field("scheduledAt"), endOfDay),
          q.neq(q.field("status"), "cancelled"),
        ),
      )
      .collect();

    console.log("Found existing consultations:", existingConsultations.length);
    console.log(
      "Consultation details:",
      existingConsultations.map((c) => ({
        scheduledAt: new Date(c.scheduledAt),
        hour: new Date(c.scheduledAt).getHours(),
        status: c.status,
      })),
    );

    const bookedHours = new Set(
      existingConsultations.map((c) => new Date(c.scheduledAt).getHours()),
    );
    console.log("Booked hours:", Array.from(bookedHours));

    const availableSlots = [];
    for (let hour = 9; hour <= 16; hour++) {
      // End at 16 (4 PM) so last slot is 4-5 PM
      if (!bookedHours.has(hour)) {
        availableSlots.push({
          time: `${hour}:00`,
          timestamp: new Date(args.date).setHours(hour, 0, 0, 0),
        });
      }
    }

    console.log("Available slots:", availableSlots);
    return availableSlots;
  },
});

export const create = mutation({
  args: {
    attorneyId: v.id("attorneys"),
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.optional(v.string()),
    scheduledAt: v.number(),
    duration: v.number(),
    consultationType: v.union(v.literal("hourly"), v.literal("fixed")),
    packageId: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const attorney = await ctx.db.get(args.attorneyId);
    if (!attorney) {
      throw new ConvexError("Attorney not found");
    }

    const scheduledDate = new Date(args.scheduledAt);
    const now = new Date();

    if (scheduledDate < now) {
      throw new ConvexError("Cannot book consultation in the past");
    }

    const startOfDay = new Date(scheduledDate).setHours(0, 0, 0, 0);
    const endOfDay = new Date(scheduledDate).setHours(23, 59, 59, 999);

    const conflictingConsultations = await ctx.db
      .query("consultations")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .filter((q) =>
        q.and(
          q.gte(q.field("scheduledAt"), startOfDay),
          q.lte(q.field("scheduledAt"), endOfDay),
          q.neq(q.field("status"), "cancelled"),
        ),
      )
      .collect();

    const requestedTime = scheduledDate.getHours();
    const isTimeSlotTaken = conflictingConsultations.some((consultation) => {
      return new Date(consultation.scheduledAt).getHours() === requestedTime;
    });

    if (isTimeSlotTaken) {
      throw new ConvexError("This time slot is already booked");
    }

    let clientId = null;
    const existingClient = await ctx.db
      .query("clients")
      .withIndex("by_email", (q) => q.eq("email", args.clientEmail))
      .first();

    if (existingClient) {
      clientId = existingClient._id;
    } else {
      clientId = await ctx.db.insert("clients", {
        fullName: args.clientName,
        email: args.clientEmail,
        phone: args.clientPhone,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    let price = 0;
    if (args.consultationType === "hourly") {
      price = attorney.hourlyRate * (args.duration / 60);
    } else if (args.packageId && attorney.fixedFeePackages) {
      const pkg = attorney.fixedFeePackages.find(
        (p) => p.name === args.packageId,
      );
      if (pkg) {
        price = pkg.price;
      }
    }

    const consultationId = await ctx.db.insert("consultations", {
      attorneyId: args.attorneyId,
      clientId,
      scheduledAt: args.scheduledAt,
      duration: args.duration,
      price,
      status: "pending",
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      success: true,
      id: consultationId,
      message:
        "Consultation booked successfully. The attorney will confirm your appointment.",
    };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("consultations"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    const consultation = await ctx.db.get(args.id);
    if (!consultation) {
      throw new ConvexError("Consultation not found");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Consultation status updated successfully",
    };
  },
});

export const cancel = mutation({
  args: { id: v.id("consultations") },
  handler: async (ctx, args) => {
    const consultation = await ctx.db.get(args.id);
    if (!consultation) {
      throw new ConvexError("Consultation not found");
    }

    if (consultation.status === "completed") {
      throw new ConvexError("Cannot cancel a completed consultation");
    }

    await ctx.db.patch(args.id, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Consultation cancelled successfully",
    };
  },
});

export const getAllConsultations = query({
  args: {},
  handler: async (ctx) => {
    const consultations = await ctx.db.query("consultations").collect();
    return consultations.map((c) => ({
      id: c._id,
      attorneyId: c.attorneyId,
      scheduledAt: c.scheduledAt,
      scheduledAtISO: new Date(c.scheduledAt).toISOString(),
      scheduledAtHour: new Date(c.scheduledAt).getHours(),
      status: c.status,
      duration: c.duration,
    }));
  },
});

export const updateNotes = mutation({
  args: {
    id: v.id("consultations"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const consultation = await ctx.db.get(args.id);
    if (!consultation) {
      throw new ConvexError("Consultation not found");
    }
    await ctx.db.patch(args.id, {
      notes: args.notes,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

// New booking flow mutation with authentication
export const createBooking = mutation({
  args: {
    attorneyId: v.id("attorneys"),
    scheduledAt: v.number(),
    duration: v.number(),
    price: v.number(),
    consultationType: v.union(v.literal("video"), v.literal("in-person")),
    paymentData: v.object({
      method: v.literal("stripe"),
      transactionId: v.string(),
      amount: v.number(),
      currency: v.string(),
    }),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Must be logged in to book a consultation");
    }

    // Verify attorney exists
    const attorney = await ctx.db.get(args.attorneyId);
    if (!attorney) {
      throw new ConvexError("Attorney not found");
    }

    // Validate that the requested time slot is in the future
    const now = Date.now();
    if (args.scheduledAt < now) {
      throw new ConvexError("Cannot book consultation in the past");
    }

    // Check if slot is still available
    const endTime = args.scheduledAt + args.duration * 60 * 1000;

    // Check for conflicting consultations
    const conflictingConsultations = await ctx.db
      .query("consultations")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .filter((q) =>
        q.and(
          q.neq(q.field("status"), "cancelled"),
          q.lt(q.field("scheduledAt"), endTime),
          q.gt(
            q.add(q.field("scheduledAt"), q.mul(q.field("duration"), 60000)),
            args.scheduledAt,
          ),
        ),
      )
      .collect();

    if (conflictingConsultations.length > 0) {
      throw new ConvexError("This time slot is no longer available");
    }

    // Check for active slot reservations
    const conflictingReservations = await ctx.db
      .query("slotReservations")
      .withIndex("by_attorney_time", (q) => q.eq("attorneyId", args.attorneyId))
      .filter((q) =>
        q.and(
          q.lt(q.field("startTime"), endTime),
          q.gt(q.field("endTime"), args.scheduledAt),
          q.gt(q.field("expiresAt"), now),
          q.neq(q.field("reservedBy"), identity.subject),
        ),
      )
      .collect();

    if (conflictingReservations.length > 0) {
      throw new ConvexError("This time slot is reserved by another user");
    }

    // Get client data directly from Clerk identity
    const clientEmail = identity.email || "";
    const clientName =
      identity.given_name && identity.family_name
        ? `${identity.given_name} ${identity.family_name}`
        : identity.name || identity.email || "Unknown User";
    const clientUserId = identity.subject;

    // Create the consultation
    const consultationId = await ctx.db.insert("consultations", {
      attorneyId: args.attorneyId,
      clientId: clientUserId,
      clientEmail: clientEmail,
      clientName: clientName,
      scheduledAt: args.scheduledAt,
      duration: args.duration,
      price: args.price,
      status: "confirmed", // Since payment was processed
      consultationType: args.consultationType,
      notes:
        args.notes ||
        `${args.consultationType === "video" ? "Видео" : "Лична"} консултация`,
      createdAt: now,
      updatedAt: now,
    });

    // Clean up any reservations for this slot and user
    const userReservations = await ctx.db
      .query("slotReservations")
      .withIndex("by_reserved_by", (q) => q.eq("reservedBy", identity.subject))
      .filter((q) => q.eq("attorneyId", args.attorneyId))
      .collect();

    for (const reservation of userReservations) {
      await ctx.db.delete(reservation._id);
    }

    return {
      success: true,
      id: consultationId,
      message: "Consultation booked successfully",
    };
  },
});
