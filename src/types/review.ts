import { Doc, Id } from '../../convex/_generated/dataModel'

export type Review = Doc<'reviews'>

export interface ReviewCreateData {
  consultationId: Id<'consultations'>
  attorneyId: Id<'attorneys'>
  clientId: Id<'clients'>
  rating: number
  comment?: string
}

export interface AttorneyReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}