# Novella Tracker — Product Spec

## What This App Does
A personal reading tracker for the "100 Greatest Novellas" reading plan.
Users work through the plan (Quick Wins path, then 10 Theme Clusters)
and track their progress.

## Core Features (MVP)
1. Dashboard showing overall progress and current read
2. Full reading plan view organized by section
3. Book detail view with notes and film info
4. Mark books as: not started / currently reading / read
5. Progress persists in Supabase database

## NOT in MVP
- No user accounts or login (schema is auth-ready with nullable user_id)
- No ratings or personal notes UI (columns exist in DB for future use)
- No social features or sharing
- No reading time estimates
- No calendar integration

## Multi-Device Access
The database uses a two-table design (books + reading_progress) with a
nullable user_id on reading_progress. Adding Supabase Auth later requires:
make user_id required, add RLS policy (user_id = auth.uid()), add login page.
No data migration or schema restructuring needed.

## Content Source
All book data comes from the "100 Greatest Novellas" reading plan documents.
The data is static — only the user's reading status changes.

## Target User
A single user (the app creator) tracking their personal reading progress
across multiple devices. Auth will be added soon after MVP to enable this.
