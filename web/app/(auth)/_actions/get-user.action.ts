"use server";
import { getSession } from "@/lib/auth/session";

export async function getUserAction() {
  const session = await getSession();
  return session?.user ?? null;
}
