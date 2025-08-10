import { Doc, Id } from "../../convex/_generated/dataModel";

export type Consultation = Doc<"consultations">;
export type ConsultationId = Id<"consultations">;

export type ConsultationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface ConsultationCreateData {
  attorneyId: Id<"attorneys">;
  clientId: Id<"clients">;
  scheduledAt: number;
  duration: number;
  price: number;
  notes?: string;
}
