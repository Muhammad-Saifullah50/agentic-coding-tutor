---
id: 0009
title: Disable next lesson button if the next lesson is locked
stage: general
date: 2025-11-18
surface: agent
model: gemini-1.5-flash
feature: none
branch: main
user: saifullah
command: the next lesson button should be dislabled if the next lesson is locked
labels: ["frontend", "react", "course", "ux"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/src/components/Course.tsx
  - frontend/src/components/course/LessonContent.tsx
  - frontend/src/components/course/LessonQuiz.tsx
  - frontend/src/components/course/LessonPlayground.tsx
tests_yaml: []
prompt_text: |
  the next lesson button should be dislabled if the next lesson is locked
response_text: |
  I have updated the lesson components (`LessonContent.tsx`, `LessonQuiz.tsx`, and `LessonPlayground.tsx`) to disable the "Next Lesson" button if the next lesson is locked.
---
