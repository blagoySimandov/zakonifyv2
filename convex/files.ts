import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByMatter = query({
  args: { matterId: v.id("matters") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("files")
      .withIndex("by_matter", (q) => q.eq("matterId", args.matterId))
      .order("desc")
      .collect();
  },
});

export const upload = mutation({
  args: {
    matterId: v.id("matters"),
    uploadedByRole: v.union(v.literal("attorney"), v.literal("client")),
    uploadedById: v.union(v.id("attorneys"), v.id("clients")),
    fileUrl: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("files", {
      ...args,
      createdAt: now,
    });
    await ctx.db.patch(args.matterId, { updatedAt: now });
    return { success: true, id };
  },
});

