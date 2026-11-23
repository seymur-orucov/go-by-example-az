// Conventional Commits (https://www.conventionalcommits.org/en/v1.0.0/). See CONTRIBUTING.md.
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Scopes are optional; when used they must be one of these (docs/DECISIONS.md).
    "scope-enum": [
      2,
      "always",
      ["design", "site", "theme", "content", "docs", "ci", "deps", "repo", "api"],
    ],
    "subject-max-length": [2, "always", 72],
    "header-max-length": [2, "always", 72],
  },
};
