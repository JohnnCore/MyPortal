/**
 * Common Utility Types
 */

// Make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Make specific properties required
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Make specific properties optional
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Nullable type
export type Nullable<T> = T | null;

// ID type for entities
export type ID = number;

// Timestamp string (ISO format)
export type ISODateString = string;

// Extract array element type
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

// Async function return type
export type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> = T extends (
  ...args: unknown[]
) => Promise<infer R>
  ? R
  : never;

// Function that can be sync or async
export type MaybeAsync<T> = T | Promise<T>;

// Key-value record with string keys
export type StringRecord<T = unknown> = Record<string, T>;

// Omit multiple keys
export type OmitMultiple<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
