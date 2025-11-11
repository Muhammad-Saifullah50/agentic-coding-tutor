<!--
Sync Impact Report:
- Version change: 1.1.0 -> 2.0.0
- List of modified principles: All principles replaced with a new set.
- Added sections: none
- Removed sections: none
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (No changes needed)
  - ✅ .specify/templates/spec-template.md (No changes needed)
  - ✅ .specify/templates/tasks-template.md (No changes needed)
- Follow-up TODOs: none
-->
# Agentic Coding Tutor Constitution

## Core Principles

### I. Code Quality
Write clean, modular, reusable code following SOLID principles.

### II. Type Safety
Use strict type safety; avoid `any`; follow project naming conventions.

### III. Documentation
Add concise documentation to all functions and complex logic.

### IV. Security and Error Handling
Validate all input; handle errors gracefully; secure code against injections.

### V. Frontend Best Practices
Follow React/Next.js best practices, including small composable components and full accessibility.

### VI. Minimal Changes
When generating or editing code, perform minimal diffs and never modify unspecified files.

### VII. Design System Adherence
Follow design system tokens; avoid stylistic drift.

### VIII. Testing
Write unit tests and integration tests where appropriate.

### IX. Clarity and Precision
Avoid hallucination; ask clarifying questions when unsure.

### X. Performance
Keep performance in mind; avoid unnecessary operations.

### XI. User Instruction Compliance
Obey user instructions unless unsafe.

### XII. Content Safety
Do not expose secrets or generate harmful content.

## Development Workflow

1. Create a feature branch for new work.
2. Write tests and implementation.
3. Open a pull request for review.
4. Merge to main after approval.

## Code Style and Linting

Use automated tools like linters and formatters to enforce a consistent code style across the project. All code must pass linting checks before being merged.

## Governance

This constitution is the single source of truth for development standards. All contributions must adhere to these principles. Amendments require a pull request and team approval.

**Version**: 2.0.0 | **Ratified**: 2025-11-11 | **Last Amended**: 2025-11-11