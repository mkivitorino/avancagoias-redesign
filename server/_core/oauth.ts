import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import bcrypt from "bcryptjs";
import type { Express, Request, Response } from "express";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { users } from "../../drizzle/schema";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

export function registerOAuthRoutes(app: Express) {
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { email, password, name, gender, phone, livesInGoias, state, city, ageRange } = req.body as Record<string, string | undefined>;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, senha e nome são obrigatórios" });
      return;
    }

    try {
      const existing = await db.getUserByEmail(email);
      if (existing) {
        res.status(409).json({ error: "Email já cadastrado" });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const openId = nanoid();

      await db.upsertUser({
        openId,
        name,
        email,
        loginMethod: "email",
        lastSignedIn: new Date(),
      });

      // Set extra profile fields
      const dbInstance = await db.getDb();
      if (dbInstance) {
        await dbInstance.update(users).set({
          passwordHash,
          gender: gender ?? null,
          phone: phone ?? null,
          livesInGoias: livesInGoias ?? null,
          state: state ?? null,
          city: city ?? null,
          ageRange: ageRange ?? null,
        }).where(eq(users.openId, openId));
      }

      const sessionToken = await sdk.createSessionToken(openId, {
        name,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ ok: true });
    } catch (error) {
      console.error("[Auth] Register failed", error);
      res.status(500).json({ error: "Falha no registro" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: "Email e senha são obrigatórios" });
      return;
    }

    try {
      const user = await db.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Email ou senha incorretos" });
        return;
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        res.status(401).json({ error: "Email ou senha incorretos" });
        return;
      }

      await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });

      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ ok: true });
    } catch (error) {
      console.error("[Auth] Login failed", error);
      res.status(500).json({ error: "Falha no login" });
    }
  });
}
