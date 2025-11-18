---
id: 0008
title: Fix navigation to previously completed lessons with lazy useState
stage: general
date: 2025-11-18
surface: agent
model: gemini-1.5-flash
feature: none
branch: main
user: saifullah
command: but now i am unable to go to a prev leson
labels: ["frontend", "react", "course", "bug", "ux"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/src/components/Course.tsx
tests_yaml: []
prompt_text: |
  but now i am unable to go to a prev leson
response_text: |
  I have replaced the `useEffect` hook with a lazy `useState` initializer in `frontend/src/components/Course.tsx`. This should correctly set the initial lesson to the first incomplete one, while still allowing the user to navigate freely to any completed lesson.
---
