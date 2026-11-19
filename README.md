# Sheridan Halloween Event Sign-Up — DESN31927 Project 2

**Student:** Siyuan Chen
**Project:** DESN31927 Project 2 — Persistent Data: Database-Driven Web App
**Topic:** A sign-up form for a Halloween event at Sheridan College. Attendees
answer **18 questions** in three groups — About You, Your Event Plan, and
Food, Help and Ideas. The organizer collects all sign-ups in one list to plan
headcount and materials — for example, if 12 people picked Pumpkin Carving,
the organizer knows to prepare about 12 pumpkins and enough carving tools.

**v9 note:** The page background is a Halloween pattern image
(`public/images/halloween-pattern.jpg`) — a dark purple-black pattern of small
pumpkins, bats, ghosts, crescent moons, spider webs, candy and stars, set as a
fixed full-page background behind the form and list.

Background image: AI-generated for this project.

## What this app does — full CRUD

Unlike the in-class Resume Builder demo (Create + Read only), this app supports
the **full data lifecycle**:

| CRUD   | HTTP verb | Endpoint              | Frontend action                                       |
| ------ | --------- | --------------------- | ----------------------------------------------------- |
| Create | POST      | `/api/signups`        | Fill the sign-up form and submit                      |
| Read   | GET       | `/api/signups`        | Sign-up list below the form, newest first, with totals |
| Read   | GET       | `/api/signups/:id`    | Single sign-up (API)                                  |
| Update | PUT       | `/api/signups/:id`    | Click **Edit** → form fills with every field → "Update sign-up" |
| Delete | DELETE    | `/api/signups/:id`    | Click **Delete** → confirm dialog → removed           |

Validation errors return **400** with a clear message; a missing or malformed
id returns **404**.

The list header also shows a live total computed in the frontend from the
fetched list: `X sign-ups · Y people total` — the organizer's headcount.

## How the organizer uses the collected list

- **Headcount by activity** — each list item shows its activity, so the
  organizer can count how many people chose Pumpkin Carving, the Costume
  Contest, and so on, and prepare the right room and materials for each.
- **Headcount by campus and arrival time** — items show campus
  (Davis / Trafalgar / Hazel McCallion) and arrival time (6:00 / 7:00 /
  8:00 PM), so the organizer knows when to expect each group and how many
  people are coming from each campus.
- **Which promotion worked (`how_heard`)** — items show how each attendee
  heard about the event (friend, teacher announcement, poster, social media,
  email), so the organizer knows which promotion channel actually reached
  students.
- **Food prep by `food_needs` and `candy_preference`** — items with a food
  need other than "None" (Vegetarian, Halal, Nut Allergy, Other) are marked
  in the list, and candy preferences show what snacks to buy, so food can be
  prepared safely for everyone.
- **Volunteer list (`volunteer`)** — attendees who offered to help with setup
  before the event or during the event are marked in the list, so the
  organizer can plan the helper team.
- **Accessibility prep (`accessibility_needs`)** — any accessibility needs
  an attendee wrote are shown in the list, so the organizer can prepare
  before the event instead of finding out at the door.
- **Photo permission list** — items marked "Photo OK" are the attendees who
  agreed that photos of them at the event may be used in Sheridan posts.
  Only those people should appear in posted photos.

## Tech stack

- JavaScript, Node.js (ESM — `import`, not CommonJS)
- Express API, exposed on Netlify as a Function via `serverless-http`
- Mongoose (latest 8.x) → MongoDB Atlas, one env var: `MONGODB_URI`
- Database: `project2_db` · Collection/model: `signups`
- Frontend in `public/`: native HTML form, Constraint Validation API with inline
  feedback, a `<template>` element for list items, populated with `textContent`
  (user data is never injected with `innerHTML`)
- **No login** — out of scope for this project. Anyone with the public link can
  sign up and view/change the list. **Use fictional test data only.**

## Schema — `signups` (18 stored fields, grouped like the form)

### About You

| Field           | Type   | Rules                                                                 |
| --------------- | ------ | --------------------------------------------------------------------- |
| name            | String | required, max 80                                                      |
| email           | String | required, must match a simple valid email pattern                     |
| phone           | String | optional, max 20 (contact phone)                                      |
| campus          | String | required, one of: Davis, Trafalgar, Hazel McCallion                   |
| attendee_type   | String | required, one of: Student, Staff, Guest                               |
| how_heard       | String | required, one of: Friend or Classmate, Teacher or Class Announcement, Poster on Campus, Instagram or Social Media, Email, Other |
| attended_before | String | required, one of: Yes, No (been to a Sheridan Halloween event before) |

### Your Event Plan

| Field         | Type   | Rules                                                                                     |
| ------------- | ------ | ----------------------------------------------------------------------------------------- |
| activity      | String | required, one of: Costume Contest, Pumpkin Carving, Horror Movie Night, Haunted House Tour |
| arrival_time  | String | required, one of: 6:00 PM, 7:00 PM, 8:00 PM                                               |
| guests        | Number | required, whole number 1–4 (total people in the party, including the person signing up)   |
| costume_theme | String | optional, one of: Scary, Movie or Anime Character, Funny, Cute, Original Design, No Costume |
| costume       | String | optional, max 200 (planned costume)                                                       |

### Food, Help and Ideas

| Field               | Type    | Rules                                                                 |
| ------------------- | ------- | --------------------------------------------------------------------- |
| food_needs          | String  | optional, one of: None, Vegetarian, Halal, Nut Allergy, Other — default `None` |
| candy_preference    | String  | optional, one of: Chocolate, Gummy Candy, Sour Candy, Chips, Cookies, No Preference |
| volunteer           | String  | optional, one of: No, Yes - Setup Before the Event, Yes - During the Event — default `No` |
| accessibility_needs | String  | optional, max 200                                                     |
| suggestions         | String  | optional, max 500 (ideas or suggestions for the event; a textarea in the form) |
| photo_permission    | Boolean | optional, default `false` — agrees that event photos of them may be used in Sheridan posts |

Plus automatic `createdAt` / `updatedAt` timestamps (Mongoose).

## Project structure

```
public/                  Frontend (index.html, app.js, style.css) — dark Halloween styling
src/config.js            App name + description
src/app.js               Shared Express app + all CRUD routes
src/db.js                Cached Mongoose connection (from MONGODB_URI)
src/models/Signup.js     Mongoose schema/model for "signups"
server.js                Local server (serves public/ + the same Express app)
netlify/functions/api.js Netlify Function handler (serverless-http)
netlify.toml             publish = "public", /api/* → the function
.env.example             Connection-string template (no real credentials)
```

## Setup

### 1. MongoDB Atlas

1. Create a free Atlas cluster (or reuse an existing free cluster with a new database).
2. Database Access: create a database user.
3. Network Access: allow your IP — and for Netlify, add `0.0.0.0/0`
   (Netlify Functions do not have a fixed IP).
4. Click **Connect → Drivers** and copy the connection string. Put the database
   name `project2_db` in the URI path. The `signups` collection is created
   automatically by Mongoose on the first save — no manual setup, no index needed.

### 2. Local run

```bash
cp .env.example .env     # then paste your real MONGODB_URI into .env (never commit it)
npm install
npm run dev              # Netlify CLI via npx (netlify-cli is NOT a dependency)
# — or, without the Netlify CLI —
npm start                # Express at http://localhost:3000
```

On Windows PowerShell, if `npm` is blocked by the scripts policy, use `npm.cmd`.

### 3. GitHub

Create a new repository, commit everything **except** `.env` and `node_modules`
(both are in `.gitignore`), and push.

### 4. Netlify deploy

1. Netlify → Add new site → Import from GitHub → pick the repo.
2. Build settings come from `netlify.toml` (publish `public`, functions `netlify/functions`).
3. Site configuration → Environment variables: add `MONGODB_URI` with the same
   Atlas connection string (database `project2_db`).
4. Deploy, then open the public URL: add a sign-up, edit it, delete it — each
   action should be visible in Atlas (Browse Collections → `project2_db` → `signups`).

## Test data (fictional examples)

Three example sign-ups, written the way the form submits them (one row per
sign-up, fields grouped in the same order as the form):

**Row 1 — Alex Vampire**
About You: name Alex Vampire · email alex@example.com · phone 905-555-0100 · campus Davis · attendee_type Student · how_heard Friend or Classmate · attended_before Yes
Event Plan: activity Pumpkin Carving · arrival_time 6:00 PM · guests 2 · costume_theme Scary · costume "Vampire cape"
Food, Help and Ideas: food_needs None · candy_preference Chocolate · volunteer Yes - Setup Before the Event · accessibility_needs (none) · suggestions "More pumpkins this year" · photo_permission true

**Row 2 — Sam Witch**
About You: name Sam Witch · email sam@example.com · phone (none) · campus Trafalgar · attendee_type Student · how_heard Poster on Campus · attended_before No
Event Plan: activity Costume Contest · arrival_time 7:00 PM · guests 1 · costume_theme Movie or Anime Character · costume "Witch hat"
Food, Help and Ideas: food_needs Vegetarian · candy_preference Gummy Candy · volunteer No · accessibility_needs (none) · suggestions (none) · photo_permission false

**Row 3 — Jordan Ghost**
About You: name Jordan Ghost · email jordan@example.com · phone 905-555-0102 · campus Hazel McCallion · attendee_type Guest · how_heard Instagram or Social Media · attended_before No
Event Plan: activity Horror Movie Night · arrival_time 8:00 PM · guests 4 · costume_theme Funny · costume "Ghost costume"
Food, Help and Ideas: food_needs Nut Allergy · candy_preference Sour Candy · volunteer Yes - During the Event · accessibility_needs "Needs a seat near the door" · suggestions "Play a classic horror movie" · photo_permission true

## v10 fix (2026-11-19)

Netlify's bundler wrapped the Express app import in a module namespace object, so `serverless-http` could not detect the app and the api function crashed with "Unsupported framework" before reaching the database. `netlify/functions/api.js` now unwraps the app (`importedApp?.default ?? importedApp`) and passes a plain `(req, res)` handler to `serverless-http`. Verified locally using Netlify's own `@netlify/zip-it-and-ship-it` packaging: the bundled handler returns the app's JSON responses instead of crashing. No other code changed from v9.
