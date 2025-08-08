import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { PRACTICE_AREAS } from "@/constants";
import { convex } from "@/lib/utils";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

const AttorneySearchSchema = z.object({
  limit: z.number().optional(),
  practiceAreas: z.array(z.string()).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  isVerified: z.boolean().optional(),
});

const AttorneyRegistrationSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  barAssociationId: z.string().min(5).max(20),
  bio: z.string().min(50).max(1000).optional(),
  education: z.string().min(10).max(500).optional(),
  yearsOfExperience: z.number().min(0).max(70),
  practiceAreas: z
    .array(z.enum(PRACTICE_AREAS as unknown as [string, ...string[]]))
    .min(1)
    .max(5),
  hourlyRate: z.number().min(50).max(2000),
  fixedFeePackages: z
    .array(
      z.object({
        name: z.string().min(5).max(100),
        description: z.string().min(20).max(500),
        price: z.number().min(100).max(50000),
      })
    )
    .optional(),
  location: z.object({
    city: z.string().min(2).max(50),
    state: z.string().min(2).max(50),
    country: z.string().min(2).max(50),
  }),
  languages: z.array(z.string()).optional(),
  profileImage: z.string().optional(),
});

const ReviewCreateSchema = z.object({
  attorneyId: z.string(),
  clientName: z.string().min(2).max(100),
  clientEmail: z.string().email(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
});

const ConsultationCreateSchema = z.object({
  attorneyId: z.string(),
  clientName: z.string().min(2).max(100),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  scheduledAt: z.number(),
  duration: z.number().min(30).max(480),
  consultationType: z.enum(["hourly", "fixed"]),
  packageId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  attorneys: router({
    getAll: publicProcedure
      .input(AttorneySearchSchema)
      .query(async ({ input }) => {
        try {
          const attorneys = await convex.query(api.attorneys.getAll, {
            limit: input.limit,
            practiceAreas: input.practiceAreas,
            city: input.city,
            state: input.state,
            isVerified: input.isVerified,
          });
          return attorneys;
        } catch (error) {
          console.error("Failed to fetch attorneys:", error);
          return [];
        }
      }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        try {
          const attorney = await convex.query(api.attorneys.getById, {
            id: input.id as Id<"attorneys">,
          });
          return attorney;
        } catch (error) {
          console.error("Failed to fetch attorney:", error);
          return null;
        }
      }),

    checkEmailExists: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        try {
          return await convex.query(api.attorneys.checkEmailExists, {
            email: input.email,
          });
        } catch (error) {
          console.error("Failed to check email:", error);
          return false;
        }
      }),

    checkBarIdExists: publicProcedure
      .input(z.object({ barAssociationId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await convex.query(api.attorneys.checkBarIdExists, {
            barAssociationId: input.barAssociationId,
          });
        } catch (error) {
          console.error("Failed to check bar ID:", error);
          return false;
        }
      }),

    register: publicProcedure
      .input(AttorneyRegistrationSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await convex.mutation(api.attorneys.register, input);
          return result;
        } catch (error) {
          console.error("Registration failed:", error);
          if (error instanceof Error) {
            if (error?.message) {
              throw new Error(error.message);
            }
          }

          throw new Error("Registration failed. Please try again.");
        }
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          fullName: z.string().optional(),
          bio: z.string().optional(),
          education: z.string().optional(),
          yearsOfExperience: z.number().optional(),
          practiceAreas: z.array(z.string()).optional(),
          hourlyRate: z.number().optional(),
          location: z
            .object({
              city: z.string(),
              state: z.string(),
              country: z.string(),
            })
            .optional(),
          languages: z.array(z.string()).optional(),
          profileImage: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await convex.mutation(api.attorneys.update, {
          id: input.id as Id<"attorneys">,
          fullName: input.fullName,
          bio: input.bio,
          education: input.education,
          yearsOfExperience: input.yearsOfExperience,
          practiceAreas: input.practiceAreas,
          hourlyRate: input.hourlyRate,
          location: input.location,
          languages: input.languages,
          profileImage: input.profileImage,
        });
      }),
  }),

  matters: router({
    // Placeholder: list matters by attorney would query a Convex function for matters
    listByAttorney: publicProcedure
      .input(z.object({ attorneyId: z.string() }))
      .query(async () => {
        return [] as const;
      }),
  }),

  clients: router({
    getByAttorneyId: publicProcedure
      .input(z.object({ attorneyId: z.string() }))
      .query(async ({ input }) => {
        try {
          const clients = await convex.query(api.clients.getByAttorneyId, {
            attorneyId: input.attorneyId as Id<"attorneys">,
          });
          return clients;
        } catch (error) {
          console.error("Failed to fetch clients:", error);
          return [];
        }
      }),
  }),

  messages: router({
    listByMatter: publicProcedure
      .input(z.object({ matterId: z.string() }))
      .query(async ({ input }) => {
        return await convex.query(api.messages.listByMatter, {
          matterId: input.matterId as Id<"matters">,
        });
      }),
    send: publicProcedure
      .input(
        z.object({
          matterId: z.string(),
          senderRole: z.enum(["attorney", "client"]),
          senderId: z.string(),
          content: z.string(),
          attachmentIds: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await convex.mutation(api.messages.send, {
          matterId: input.matterId as Id<"matters">,
          senderRole: input.senderRole,
          senderId: input.senderId as Id<"attorneys">, // sending from attorney in dashboard
          content: input.content,
          attachmentIds: input.attachmentIds as string[] | undefined as
            | Id<"files">[]
            | undefined,
        });
      }),
  }),

  files: router({
    listByMatter: publicProcedure
      .input(z.object({ matterId: z.string() }))
      .query(async ({ input }) => {
        return await convex.query(api.files.listByMatter, {
          matterId: input.matterId as Id<"matters">,
        });
      }),
    upload: publicProcedure
      .input(
        z.object({
          matterId: z.string(),
          uploadedByRole: z.enum(["attorney", "client"]),
          uploadedById: z.string(),
          fileUrl: z.string(),
          fileName: z.string(),
          fileSize: z.number(),
          mimeType: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return await convex.mutation(api.files.upload, {
          matterId: input.matterId as Id<"matters">,
          uploadedByRole: input.uploadedByRole,
          uploadedById: input.uploadedById as Id<"attorneys">,
          fileUrl: input.fileUrl,
          fileName: input.fileName,
          fileSize: input.fileSize,
          mimeType: input.mimeType,
        });
      }),
  }),

  reviews: router({
    getByAttorneyId: publicProcedure
      .input(z.object({ attorneyId: z.string() }))
      .query(async ({ input }) => {
        try {
          const reviews = await convex.query(api.reviews.getByAttorneyId, {
            attorneyId: input.attorneyId as Id<"attorneys">,
          });
          return reviews;
        } catch (error) {
          console.error("Failed to fetch reviews:", error);
          return [];
        }
      }),

    getAverageRating: publicProcedure
      .input(z.object({ attorneyId: z.string() }))
      .query(async ({ input }) => {
        try {
          const stats = await convex.query(api.reviews.getAverageRating, {
            attorneyId: input.attorneyId as Id<"attorneys">,
          });
          return stats;
        } catch (error) {
          console.error("Failed to fetch rating stats:", error);
          return { averageRating: 0, totalReviews: 0 };
        }
      }),

    create: publicProcedure
      .input(ReviewCreateSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await convex.mutation(api.reviews.create, {
            attorneyId: input.attorneyId as Id<"attorneys">,
            clientName: input.clientName,
            clientEmail: input.clientEmail,
            rating: input.rating,
            comment: input.comment,
          });
          return result;
        } catch (error) {
          console.error("Failed to create review:", error);
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Failed to submit review. Please try again.");
        }
      }),
  }),

  consultations: router({
    getAvailableSlots: publicProcedure
      .input(
        z.object({
          attorneyId: z.string(),
          date: z.string(),
        })
      )
      .query(async ({ input }) => {
        try {
          const slots = await convex.query(
            api.consultations.getAvailableSlots,
            {
              attorneyId: input.attorneyId as Id<"attorneys">,
              date: input.date,
            }
          );
          return slots;
        } catch (error) {
          console.error("Failed to fetch available slots:", error);
          return [];
        }
      }),

    create: publicProcedure
      .input(ConsultationCreateSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await convex.mutation(api.consultations.create, {
            attorneyId: input.attorneyId as Id<"attorneys">,
            clientName: input.clientName,
            clientEmail: input.clientEmail,
            clientPhone: input.clientPhone,
            scheduledAt: input.scheduledAt,
            duration: input.duration,
            consultationType: input.consultationType,
            packageId: input.packageId,
            notes: input.notes,
          });
          return result;
        } catch (error) {
          console.error("Failed to create consultation:", error);
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Failed to book consultation. Please try again.");
        }
      }),

    updateNotes: publicProcedure
      .input(z.object({ id: z.string(), notes: z.string().optional() }))
      .mutation(async ({ input }) => {
        return await convex.mutation(api.consultations.updateNotes, {
          id: input.id as Id<"consultations">,
          notes: input.notes,
        });
      }),

    updateStatus: publicProcedure
      .input(
        z.object({
          id: z.string(),
          status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
        })
      )
      .mutation(async ({ input }) => {
        return await convex.mutation(api.consultations.updateStatus, {
          id: input.id as Id<"consultations">,
          status: input.status,
        });
      }),

    getByAttorneyId: publicProcedure
      .input(
        z.object({
          attorneyId: z.string(),
          status: z
            .enum(["pending", "confirmed", "completed", "cancelled"])
            .optional(),
        })
      )
      .query(async ({ input }) => {
        try {
          const consultations = await convex.query(
            api.consultations.getByAttorneyId,
            {
              attorneyId: input.attorneyId as Id<"attorneys">,
              status: input.status,
            }
          );
          return consultations;
        } catch (error) {
          console.error("Failed to fetch consultations:", error);
          return [];
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
