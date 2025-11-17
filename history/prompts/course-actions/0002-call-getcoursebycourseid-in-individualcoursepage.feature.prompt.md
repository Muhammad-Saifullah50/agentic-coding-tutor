---
id: 0002
title: Call getCourseByCourseId in IndividualCoursePage
stage: feature
feature: course-actions
date: 2025-11-17
surface: agent
model: gemini-1.5-pro
branch: main
user: saifullah
command: call the created server action here and pass the course id from this page component which will b e accwessed via params. use context7 to know how to get params in dynamic routres
labels: ["server-actions", "supabase", "next.js", "react"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/src/app/(root)/courses/[slug]/page.tsx
tests_yaml: []
prompt_text: |
  call the created server action here and pass the course id from this page component which will b e accwessed via params. use context7 to know how to get params in dynamic routres
response_text: |
  I have successfully updated the `frontend/src/app/(root)/courses/[slug]/page.tsx` file to call the `getCourseByCourseId` server action and pass the fetched course data to the `<Course />` component.
outcome: |
  The `IndividualCoursePage` component in `frontend/src/app/(root)/courses/[slug]/page.tsx` has been updated to an async component. It now correctly fetches course data using the `getCourseByCourseId` server action, retrieves the course ID from the `params.slug`, and passes the fetched data to the `Course` component.
---
