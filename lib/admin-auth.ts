import "server-only";
import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "dmn_rayan";
const SESSION_SECONDS = 60 * 60 * 12;

function adminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length > 0 ? password : null;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function sign(payload: string, password: string): string {
  const key = digest(`damnit-rayan-session:${password}`);
  return createHmac("sha256", key).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  // Hash first: timingSafeEqual needs equal-length buffers.
  return timingSafeEqual(digest(a), digest(b));
}

export function isAdminConfigured(): boolean {
  return adminPassword() !== null;
}

export function passwordMatches(input: string): boolean {
  const password = adminPassword();
  if (!password) return false;
  return safeEqual(input, password);
}

export async function createAdminSession(): Promise<void> {
  const password = adminPassword();
  if (!password) throw new Error("ADMIN_PASSWORD is not set");

  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  const payload = String(expiresAt);
  const jar = await cookies();
  jar.set(COOKIE_NAME, `${payload}.${sign(payload, password)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/rayan",
    maxAge: SESSION_SECONDS,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { path: "/rayan", maxAge: 0 });
}

export async function isAdmin(): Promise<boolean> {
  const password = adminPassword();
  if (!password) return false;

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  return safeEqual(signature, sign(payload, password));
}
