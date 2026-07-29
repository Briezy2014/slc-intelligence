const GENERIC_AUTH_ERROR =
  "We could not complete that request. Check your information and try again.";

export function mapAuthError(error: unknown): string {
  const status = typeof error === "object" && error !== null && "status" in error ? error.status : null;
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String(error.message).toLowerCase()
      : "";

  if (status === 429 || message.includes("rate") || message.includes("too many")) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }

  if (
    message.includes("invalid login") ||
    message.includes("invalid credentials") ||
    message.includes("invalid email or password") ||
    message.includes("wrong password")
  ) {
    return "Invalid email or password. Set or update the password in Supabase Authentication → Users, then try again.";
  }

  if (message.includes("email not confirmed")) {
    return "This email is not confirmed yet. Confirm the user in Supabase Authentication → Users.";
  }

  if (message.includes("redirect") && message.includes("url")) {
    return "Password reset is blocked by Auth redirect URL settings. Add your Vercel URL in Supabase Authentication → URL Configuration.";
  }

  if (message.includes("password should be") || message.includes("weak password")) {
    return "Choose a stronger password and try again.";
  }

  if (message.includes("session") || message.includes("expired")) {
    return "Your session has expired. Please request a new link and try again.";
  }

  return GENERIC_AUTH_ERROR;
}

export function passwordResetRequestMessage(): string {
  return "If an account exists for that email, password reset instructions will be sent.";
}

export function configurationNeededMessage(): string {
  return "Supabase authentication is not configured for this environment. Set the Supabase URL and anon key to sign in.";
}
