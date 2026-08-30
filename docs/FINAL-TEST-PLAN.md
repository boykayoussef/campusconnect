# CampusConnect Final Test Plan

This test plan follows the course emphasis on unit, integration, system and user-acceptance testing, plus black-box API testing with Postman.

## 1. Smoke / health

| ID | Test | Expected |
|---|---|---|
| S-01 | `GET /api/health` | HTTP 200 and `database: connected` |
| S-02 | Start backend with invalid DB URL | Server fails loudly instead of pretending it is ready |
| S-03 | Open mobile guest mode | App opens without authentication |

## 2. Authentication

| ID | Test | Expected |
|---|---|---|
| A-01 | Register student with valid data | 201, hashed password stored, JWT returned |
| A-02 | Register duplicate email | 409 |
| A-03 | Login with wrong password | 401 |
| A-04 | Login with valid credentials | 200 + JWT + public user object |
| A-05 | `/api/auth/me` without token | 401 |
| A-06 | Club Leader registration | Account starts as `pending` |

## 3. Authorization / RBAC

| ID | Test | Expected |
|---|---|---|
| R-01 | Student creates event | 403 |
| R-02 | Pending leader creates event | 403 |
| R-03 | Admin approves leader | 200 and status becomes `approved` |
| R-04 | Approved leader creates event | 201 |
| R-05 | Leader edits another leader's event | 403 |
| R-06 | Admin deletes any event | 200 |

## 4. Event CRUD

| ID | Test | Expected |
|---|---|---|
| E-01 | Public event list | 200 |
| E-02 | Search by keyword | Matching events only |
| E-03 | Filter by category/type/status | Matching events only |
| E-04 | Get event details | Creator and capacity information returned |
| E-05 | Create event | AI category or deterministic fallback assigned |
| E-06 | Update event description | Category is recalculated |
| E-07 | Delete owned event | Event removed |

## 5. Registration business rules

| ID | Test | Expected |
|---|---|---|
| G-01 | Student RSVP to open event | 201 |
| G-02 | Same student RSVPs twice | 409 |
| G-03 | RSVP to closed event | 400 |
| G-04 | RSVP after event date | 400 |
| G-05 | RSVP when capacity is full | 400 |
| G-06 | Student views own registrations | 200 |
| G-07 | Student cancels own registration | 200 and status `cancelled` |
| G-08 | Leader views registrants for own event | 200 |
| G-09 | Leader views another leader's registrants | 403 |
| G-10 | Leader confirms/cancels own event registration | 200 |

## 6. Frontend / mobile UAT

1. A visitor can browse the event feed without creating an account on mobile guest mode.
2. A visitor can open an event and save a local RSVP.
3. The visitor can later open Profile and choose Login / Create account.
4. A registered student can RSVP and see the registration in My RSVPs.
5. A club leader sees their event management flow after approval.
6. An admin sees pending club leaders and can approve/reject them.
7. Loading, empty and error states are shown instead of an infinite spinner.
8. The interface remains usable on phone and desktop widths.

## 7. Regression checklist before submission

- Run SQL migrations in order.
- Start backend and verify `/api/health`.
- Run the Postman collection against the local API.
- Run the web frontend and test Register -> Login -> Event -> RSVP.
- Run Expo and test Guest -> Event -> local RSVP -> Login.
- Confirm no `.env` file is committed.
- Confirm the GitHub repository contains README, migrations, API code and frontend/mobile source.
