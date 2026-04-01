import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = typeof req.query.code === "string" ? req.query.code : undefined;

    if (!code) {
      res.status(400).json({ error: "code is required" });
      return;
    }

    try {
      // Exchange code for tokens with Google
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          client_id: ENV.googleClientId,
          client_secret: ENV.googleClientSecret,
          redirect_uri: `${req.protocol}://${req.get("host")}/api/oauth/callback`,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.text();
        console.error("[OAuth] Token exchange failed:", err);
        res.status(500).json({ error: "Token exchange failed" });
        return;
      }

      const tokens = (await tokenRes.json()) as { access_token: string };

      // Fetch user info from Google
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      if (!userInfoRes.ok) {
        res.status(500).json({ error: "Failed to fetch user info" });
        return;
      }

      const userInfo = (await userInfoRes.json()) as {
        sub: string;
        name?: string;
        email?: string;
      };

      // Upsert user using Google `sub` as openId
      await db.upsertUser({
        openId: userInfo.sub,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: "google",
        lastSignedIn: new Date(),
      });

      // Create JWT session
      const sessionToken = await sdk.createSessionToken(userInfo.sub, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
