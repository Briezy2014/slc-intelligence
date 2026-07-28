import { z } from "zod";

/** Shell-only auth form validation. Not connected to authentication services. */
export const signInShellSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required for the form shell."),
});

export type SignInShellValues = z.infer<typeof signInShellSchema>;
