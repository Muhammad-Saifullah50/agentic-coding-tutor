---
id: 0001
title: Implement getCourseByCourseId Server Action
stage: feature
feature: course-actions
date: 2025-11-17
surface: agent
model: gemini-1.5-pro
branch: main
user: saifullah
command: create a file named course.actions.ts in the actions folder. Wrirte a server action in this file named get course by courseid which uses the supabase admin clinet and fetches a couirse from supoabase Course table . Tghe course id is passed is accessed via params and passed to the server action. Use context7 to kmnow how params are accessed in page components and how server actions are created. The supabase admin client is already present in /utils/supabase/admin
labels: ["server-actions", "supabase", "next.js"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/src/actions/course.actions.ts
tests_yaml: []
prompt_text: |
  create a file named course.actions.ts in the actions folder. Wrirte a server action in this file named get course by courseid which uses the supabase admin clinet and fetches a couirse from supoabase Course table . Tghe course id is passed is accessed via params and passed to the server action. Use context7 to kmnow how params are accessed in page components and how server actions are created. The supabase admin client is already present in /utils/supabase/admin
response_text: |
  I have successfully created the `course.actions.ts` file with the `getCourseByCourseId` server action, importing the `createAdminClient` from the specified path.
outcome: |
  The server action `getCourseByCourseId` has been implemented in `frontend/src/actions/course.actions.ts`. It correctly imports the `createAdminClient` from `frontend/src/utils/supabase/admin.ts` and fetches a course from the 'Course' table based on the provided `courseId`.
---
