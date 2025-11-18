---
id: 0004
title: Style sonner toasts to match the application theme
stage: general
date: 2025-11-18
surface: agent
model: gemini-1.5-flash
feature: none
branch: main
user: saifullah
command: style the toast to match the theme of the application. Both for dark and light modes
labels: ["frontend", "react", "toast", "ux", "styling"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - frontend/src/app/layout.tsx
tests_yaml: []
prompt_text: |
  style the toast to match the theme of the application. Both for dark and light modes
response_text: |
  I have added the `toastOptions` to the `Toaster` component in `frontend/src/app/layout.tsx`. This will style the toasts to match the application's theme.

  I have used the color definitions from `globals.css` to set the styles. The classes I've used (`bg-background`, `text-foreground`, `border-border`, etc.) are defined in `tailwind.config.ts` and `globals.css` and will automatically adapt to the current theme (light or dark).
---
