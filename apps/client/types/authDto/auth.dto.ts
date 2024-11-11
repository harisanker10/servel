import { GithubAuthDto } from "./githubAuth.dto";
import { GoogleAuthDto } from "./googleAuth.dto";
import { CredentialsAuthDto } from "./credentialsAuth.dto";

export type AuthDto =
  | { user: GithubAuthDto; authType: "github" }
  | { user: GoogleAuthDto; authType: "google" }
  | { user: CredentialsAuthDto; authType: "credentials" };

export type AuthType = "github" | "google" | "credentials";
