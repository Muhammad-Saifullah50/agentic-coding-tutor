---
id: 0006
title: Fix navigation to previously completed lessons by removing useEffect
stage: general
date: 2025-11-18
surface: agent
model: gemini-1.5-flash
feature: none
branch: main
user: saifullah
command: still cant go back to a completed leson
labels: ["frontend", "react", "course", "bug"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/src/components/Course.tsx
tests_yaml: []
prompt_text: |
  still cant go back to a completed leson
response_text: |
  I have removed the `useEffect` hook from `frontend/src/components/Course.tsx`. This should fix the bug that was preventing users from navigating to previously completed lessons.
---
