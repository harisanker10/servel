import axios from "axios";

export const validateName = (value: string): string | null => {
  return value.trim() ? null : "Name is required.";
};

export const validateRepoUrl = async (url: string): Promise<string | null> => {
  const githubPattern =
    /^https?:\/\/(www\.)?github\.com\/([\w-]+)\/([\w-]+)(\.git)?$/;
  const match = url.match(githubPattern);

  console.log({ match });

  if (!match) {
    return "Invalid GitHub repository URL.";
  }
  const [, , owner, repo] = match;

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
    );
    if (response.status === 200) {
      return null; // Repository exists
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return "Repository not found on GitHub.";
    }
    return "Error validating repository URL.";
  }

  return "Invalid repository URL.";
};

export const validateBuildCommand = (value: string): string | null => {
  return value.trim() ? null : "Build command is required.";
};

export const validateRunCommand = (value: string): string | null => {
  return value.trim() ? null : "Run command is required for web services.";
};

export const validatePort = (value: number | string): string | null => {
  console.log({ value });
  return parseInt(value.toString()) > 0
    ? null
    : "Port must be a positive integer.";
};

export const validateOutDir = (value: string): string | null => {
  return value.trim() ? null : "Output directory is required for static sites.";
};
