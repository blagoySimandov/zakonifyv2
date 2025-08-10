import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByAttorneyId = query({
  args: {
    attorneyId: v.id("attorneys"),
  },
  handler: async (ctx, args) => {
    // Get all matters for this attorney
    const matters = await ctx.db
      .query("matters")
      .withIndex("by_attorney", (q) => q.eq("attorneyId", args.attorneyId))
      .collect();

    // Get unique client IDs from matters
    const clientIds = Array.from(new Set(matters.map((m) => m.clientId)));

    // Get clients with consultation details
    const clientsWithDetails = await Promise.all(
      clientIds.map(async (clientId) => {
        const client = await ctx.db.get(clientId);
        if (!client) return null;

        // Get all consultations for this client-attorney pair
        const consultations = await ctx.db
          .query("consultations")
          .withIndex("by_client", (q) => q.eq("clientId", clientId))
          .filter((q) => q.eq(q.field("attorneyId"), args.attorneyId))
          .order("desc")
          .collect();

        // Get the active matter for this client-attorney pair
        const activeMatter = matters.find((m) => m.clientId === clientId);

        // Get the most recent consultation
        const lastConsultation = consultations[0] || null;

        return {
          ...client,
          totalConsultations: consultations.length,
          lastConsultation,
          activeMatter,
        };
      }),
    );

    // Filter out null clients and sort by most recent activity
    return clientsWithDetails
      .filter((client) => client !== null)
      .sort((a, b) => {
        const aTime = a.lastConsultation?.scheduledAt || a.createdAt;
        const bTime = b.lastConsultation?.scheduledAt || b.createdAt;
        return bTime - aTime;
      });
  },
});
