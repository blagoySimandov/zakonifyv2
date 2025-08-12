import { Doc, Id } from "../../convex/_generated/dataModel";
import { PracticeArea } from "@/constants";

export type Attorney = Doc<"attorneys">;
export type AttorneyId = Id<"attorneys">;

export interface AttorneyLocation {
  city: string;
  state: string;
  country: string;
}

export interface FixedFeePackage {
  name: string;
  description: string;
  price: number;
}

export interface AttorneySearchFilters {
  practiceAreas?: PracticeArea[];
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  minHourlyRate?: number;
  maxHourlyRate?: number;
  languages?: string[];
  yearsOfExperience?: {
    min?: number;
    max?: number;
  };
  isVerified?: boolean;
}

export interface AttorneyCreateData {
  fullName: string;
  email: string;
  barAssociationId: string;
  bio?: string;
  education?: string;
  yearsOfExperience: number;
  practiceAreas: PracticeArea[];
  hourlyRate: number;
  fixedFeePackages?: FixedFeePackage[];
  location: AttorneyLocation;
  languages: string[];
}
