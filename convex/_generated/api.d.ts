/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as attorneys from "../attorneys.js";
import type * as clients from "../clients.js";
import type * as consultations from "../consultations.js";
import type * as example from "../example.js";
import type * as files from "../files.js";
import type * as messages from "../messages.js";
import type * as reviews from "../reviews.js";
import type * as seed from "../seed.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  attorneys: typeof attorneys;
  clients: typeof clients;
  consultations: typeof consultations;
  example: typeof example;
  files: typeof files;
  messages: typeof messages;
  reviews: typeof reviews;
  seed: typeof seed;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
