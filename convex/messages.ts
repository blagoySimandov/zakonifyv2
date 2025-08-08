import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByMatter = query({
  args: { matterId: v.id("matters") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_matter", (q) => q.eq("matterId", args.matterId))
      .order("desc")
      .collect();
  },
});

export const send = mutation({
  args: {
    matterId: v.id("matters"),
    senderRole: v.union(v.literal("attorney"), v.literal("client")),
    senderId: v.union(v.id("attorneys"), v.id("clients")),
    content: v.string(),
    attachmentIds: v.optional(v.array(v.id("files"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const messageId = await ctx.db.insert("messages", {
      matterId: args.matterId,
      senderRole: args.senderRole,
      senderId: args.senderId,
      content: args.content,
      attachmentIds: args.attachmentIds,
      createdAt: now,
    });

    await ctx.db.patch(args.matterId, { updatedAt: now, lastMessageAt: now });

    return { success: true, id: messageId };
  },
});

