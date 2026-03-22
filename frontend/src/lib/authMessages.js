const getErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message.toLowerCase();
    }
    return "";
};
const includesAny = (message, fragments) => fragments.some((fragment) => message.includes(fragment));
export const isVerificationError = (error) => includesAny(getErrorMessage(error), [
    "email not confirmed",
    "email address not authorized",
    "confirm your email"
]);
export const getLoginErrorMessage = (error) => {
    const message = getErrorMessage(error);
    if (isVerificationError(error)) {
        return "Check your inbox and verify your email before logging in.";
    }
    if (includesAny(message, [
        "invalid login credentials",
        "invalid credentials",
        "invalid_grant",
        "email or password"
    ])) {
        return "Invalid email or password.";
    }
    if (includesAny(message, ["too many requests", "rate limit"])) {
        return "Too many sign-in attempts. Wait a moment, then try again.";
    }
    return "We could not sign you in right now. Please try again in a moment.";
};
export const getSignupErrorMessage = (error) => {
    const message = getErrorMessage(error);
    if (includesAny(message, ["user already registered", "already been registered"])) {
        return "That email already has an account. Try logging in instead.";
    }
    if (includesAny(message, ["password"])) {
        return "Choose a stronger password with upper and lower case letters and at least one number.";
    }
    if (includesAny(message, ["too many requests", "rate limit"])) {
        return "Too many signup attempts from this device. Wait a moment, then try again.";
    }
    return "We could not create your account right now. Please review your details and try again.";
};
export const getResendVerificationMessage = (error) => {
    const message = getErrorMessage(error);
    if (includesAny(message, ["too many requests", "rate limit"])) {
        return "You requested verification emails too quickly. Wait a minute, then try again.";
    }
    return "We could not resend the verification email right now. Please try again shortly.";
};
export const getPasswordResetRequestMessage = (_error) => "We could not start password recovery right now. Please try again shortly.";
export const getPasswordUpdateMessage = (error) => {
    const message = getErrorMessage(error);
    if (includesAny(message, ["session", "expired", "otp"])) {
        return "Your reset link has expired. Request a fresh password reset email and try again.";
    }
    return "We could not update your password right now. Please try again with a fresh reset link.";
};
