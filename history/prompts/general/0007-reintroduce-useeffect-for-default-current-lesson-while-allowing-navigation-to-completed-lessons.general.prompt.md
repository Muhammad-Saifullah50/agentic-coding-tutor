---
id: 0007
title: Reintroduce useEffect for default current lesson while allowing navigation to completed lessons
stage: general
date: 2025-11-18
surface: agent
model: gemini-1.5-flash
feature: none
branch: main
user: saifullah
command: no i want that the open lesson be the current one, that latest unlocked one, but the user should be able to go back to a completed lesson
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
  no i want that the open lesson be the current one, that latest unlocked one, but the user should be able to go back to a completed lesson
response_text: |
  I have reintroduced the `useEffect` hook in `frontend/src/components/Course.tsx` with the corrected logic.

  Now, the `currentLessonId` will be initialized to the first incomplete lesson (or the first lesson if all are completed) when the component mounts or when the `lessons` array changes. This ensures that the "open lesson" is the current one by default. At the same time, the previous change in `LessonSidebar.tsx` (`const canAccess = !lesson.locked || lesson.completed;`) still allows the user to navigate to any completed lesson by clicking on it.
---
