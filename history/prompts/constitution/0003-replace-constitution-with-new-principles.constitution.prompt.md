---
id: 0003
title: Replace Constitution with New Principles
stage: constitution
date: 2025-11-11
surface: agent
model: gemini
feature: none
branch: master
user: saifullah
command: /sp.constitution - Write clean, modular, reusable code following SOLID principles.
- Use strict type safety; avoid `any`; follow project naming conventions.
- Add concise documentation to all functions and complex logic.
- Validate all input; handle errors gracefully; secure code against injections.
- Follow React/Next.js best practices, small composable components, full accessibility.
- When generating or editing code, perform minimal diffs and never modify unspecified files.
- Follow design system tokens; avoid stylistic drift.
- Write unit tests and integration tests where appropriate.
- Avoid hallucination; ask clarifying questions when unsure.
- Keep performance in mind; avoid unnecessary operations.
- Obey user instructions unless unsafe.
- Do not expose secrets or generate harmful content.
labels: [constitution, refactor]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 (none)
---

## Prompt

/sp.constitution - Write clean, modular, reusable code following SOLID principles.
- Use strict type safety; avoid `any`; follow project naming conventions.
- Add concise documentation to all functions and complex logic.
- Validate all input; handle errors gracefully; secure code against injections.
- Follow React/Next.js best practices, small composable components, full accessibility.
- When generating or editing code, perform minimal diffs and never modify unspecified files.
- Follow design system tokens; avoid stylistic drift.
- Write unit tests and integration tests where appropriate.
- Avoid hallucination; ask clarifying questions when unsure.
- Keep performance in mind; avoid unnecessary operations.
- Obey user instructions unless unsafe.
- Do not expose secrets or generate harmful content.

## Response snapshot

I have updated the project constitution at `.specify/memory/constitution.md` to version 2.0.0, replacing the existing principles with the new set you provided.

## Outcome

- ✅ Impact: The constitution has been significantly updated to reflect a new, more detailed set of development principles.
- 🧪 Tests: No tests were run.
- 📁 Files: 1 file was created/modified.
- 🔁 Next prompts: none
- 🧠 Reflection: The process of replacing the constitution's principles was successful.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none