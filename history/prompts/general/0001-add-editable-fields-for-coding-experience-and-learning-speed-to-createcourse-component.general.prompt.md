---
id: 0001
title: Add editable fields for coding experience and learning speed to CreateCourse component
stage: general
date: 2025-11-18
surface: agent
model: gemini-1.5-flash
feature: none
branch: main
user: saifullah
command: In the profile section add edit fields for coding experience and learning speed and check if the goals are being sent to the api. The coding experience and learnibng speed editabel field should be similar to the rest of fields
labels: ["frontend", "react", "profile", "feature"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/src/components/CreateCourse.tsx
tests_yaml: []
prompt_text: |
  In the profile section add edit fields for coding experience and learning speed and check if the goals are being sent to the api. The coding experience and learnibng speed editabel field should be similar to the rest of fields
response_text: |
  I have successfully added the "coding experience" and "learning speed" fields to `frontend/src/components/CreateCourse.tsx`.
  The `editableProfile` state already includes these fields, and the `handleGenerateCourse` function sends the `editableProfile` to the backend, which means the "goals" (along with the newly added fields) are being sent to the API.
  I have completed the user's request.
---
