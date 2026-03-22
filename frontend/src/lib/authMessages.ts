const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message.toLowerCase();
  }

  return "";
};

const includesAny = (message: string, fragments: string[]) =>
  fragments.some((fragment) => message.includes(fragment));

export const isRateLimitError = (error: unknown) =>
  includesAny(getErrorMessage(error), [
    "too many requests",
    "rate limit",
    "security purposes",
    "too many signup attempts",
    "too many requests from this ip"
  ]);

export const isVerificationError = (error: unknown) =>
  includesAny(getErrorMessage(error), [
    "email not confirmed",
    "email address not authorized",
    "confirm your email"
  ]);

export const getLoginErrorMessage = (error: unknown) => {
  const message = getErrorMessage(error);

  if (isVerificationError(error)) {
    return "Check your inbox and verify your email before logging in.";
  }

  if (
    includesAny(message, [
      "invalid login credentials",
      "invalid credentials",
      "invalid_grant",
      "email or password"
    ])
  ) {
    return "Invalid email or password.";
  }

  if (isRateLimitError(error)) {
    return "Too many sign-in attempts. Wait a moment, then try again.";
  }

  return "We could not sign you in right now. Please try again in a moment.";
};

export const getSignupErrorMessage = (error: unknown) => {
  const message = getErrorMessage(error);

  if (includesAny(message, ["user already registered", "already been registered"])) {
    return "That email already has an account. Try logging in instead.";
  }

  if (includesAny(message, ["password"])) {
    return "Choose a stronger password with upper and lower case letters and at least one number.";
  }

  if (isRateLimitError(error)) {
    return "Too many signup attempts came from this shared network or device. Wait a minute, then try again. If your account was already created, go to login instead.";
  }

  return "We could not create your account right now. Please review your details and try again.";
};

export const getResendVerificationMessage = (error: unknown) => {
  if (isRateLimitError(error)) {
    return "You requested verification emails too quickly. Wait a minute, then try again.";
  }

  return "We could not resend the verification email right now. Please try again shortly.";
};

export const getPasswordResetRequestMessage = () =>
  "We could not start password recovery right now. Please try again shortly.";

export const getPasswordUpdateMessage = (error: unknown) => {
  const message = getErrorMessage(error);

  if (includesAny(message, ["session", "expired", "otp"])) {
    return "Your reset link has expired. Request a fresh password reset email and try again.";
  }

  return "We could not update your password right now. Please try again with a fresh reset link.";
};
