import type { NextFunction, Request, Response } from "express";

import { supabaseAdmin } from "../lib/supabase";

export type AuthContext = {
  userId: string;
  email: string | null;
  accessToken: string;
};

export type AuthenticatedRequest = Request & {
  auth: AuthContext;
};

export const authenticateRequest = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    response.status(401).json({ message: "Missing bearer token." });
    return;
  }

  const accessToken = authorization.replace("Bearer ", "").trim();
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !data.user) {
    response.status(401).json({ message: "Invalid session token." });
    return;
  }

  if (!data.user.email_confirmed_at) {
    response.status(403).json({ message: "Email verification is required." });
    return;
  }

  (request as AuthenticatedRequest).auth = {
    userId: data.user.id,
    email: data.user.email ?? null,
    accessToken
  };

  next();
};
