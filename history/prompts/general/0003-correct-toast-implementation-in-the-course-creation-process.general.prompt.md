---
id: 0003
title: Correct toast implementation in the course creation process
stage: general
date: 2025-11-18
surface: agent
model: gemini-1.5-flash
feature: none
branch: main
user: saifullah
command: when i clicked opn the view outline button on the toast , i didint see the outline, insted the toasty just disapperaed
labels: ["frontend", "react", "toast", "ux", "bug"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/src/components/CreateCourse.tsx
tests_yaml: []
prompt_text: |
  when i clicked opn the view outline button on the toast , i didint see the outline, insted the toasty just disapperaed
response_text: |
  I have corrected the toast implementation in the course creation process. The "View outline" toast is now persistent and will not be dismissed when the button is clicked.
---
