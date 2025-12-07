---
id: "0004"
title: "Make Toast Persistent"
stage: "refactor"
date: "2025-12-07"
surface: "agent"
model: "gemini-2.0-pro-exp"
feature: "course-actions"
branch: "main"
user: "saifullah"
command: "update toast duration"
labels: ["ui", "toast", "ux"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/src/components/CreateCourse.tsx
tests_yaml: []
prompt_text: |
  i want to see rthe course generated success toast infinitely till the user not clicks the button it
response_text: |
  Updated the success toast in CreateCourse.tsx to have `duration: Infinity` so it persists until user interaction.
outcome: "success"
evaluation: "Toast now persists indefinitely as requested."
---

# Make Toast Persistent

## User Prompt
```
i want to see rthe course generated success toast infinitely till the user not clicks the button it
```

## Assistant Response
Updated the success toast in CreateCourse.tsx to have `duration: Infinity` so it persists until user interaction.
