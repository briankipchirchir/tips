export type UserPlan = "NONE" | "SILVER" | "GOLD" | "PLATINUM";
export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  plan: UserPlan;
  role: UserRole;
  token: string;
}
