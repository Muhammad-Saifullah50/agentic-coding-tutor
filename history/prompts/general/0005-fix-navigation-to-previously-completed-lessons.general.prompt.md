---
id: 0005
title: Fix navigation to previously completed lessons
stage: general
date: 2025-11-18
surface: agent
model: gemini-1.5-flash
feature: none
branch: main
user: saifullah
command: when i try to go back to a previous completed lesson, i cant go back when i try to clikc on that prev lesson.
labels: ["frontend", "react", "course", "bug"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/src/components/course/LessonSidebar.tsx
tests_yaml: []
prompt_text: |
  when i try to go back to a previous completed lesson, i cant go back when i try to clikc on that prev lesson.
response_text: |
  I have updated the `canAccess` logic in `frontend/src/components/course/LessonSidebar.tsx`. This should allow users to navigate to previously completed lessons.
---
