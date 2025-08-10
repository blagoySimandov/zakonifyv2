import { Doc, Id } from "../../convex/_generated/dataModel";

export type Client = Doc<"clients">;
export type ClientId = Id<"clients">;

export interface ClientCreateData {
  fullName: string;
  email: string;
  phone?: string;
}
