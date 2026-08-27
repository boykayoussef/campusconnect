# CampusConnect API Documentation

**Author:** Youssef Mostafa

Base URL: `http://localhost:5000/api`

## Authentication

### POST `/auth/register`
Creates a user account.

### POST `/auth/login`
Authenticates a user and returns a JWT token.

Use the returned token as:

`Authorization: Bearer <token>`

## Users

### GET `/users/profile`
Returns the authenticated user's profile.

### PUT `/users/profile`
Updates the authenticated user's profile.

## Events

### GET `/events`
Returns available events. Supports event discovery/search/filtering according to the implemented API.

### GET `/events/:id`
Returns one event.

### POST `/events`
Creates an event for an authorized Club Leader/Admin.

### PUT `/events/:id`
Updates an event when permitted by the user's role and ownership rules.

### DELETE `/events/:id`
Deletes an event when permitted.

### GET `/events/:id/registrants`
Returns registrants for an event for an authorized Club Leader/Admin.

## Registrations

### POST `/registrations/:eventId`
Registers the authenticated student for an event.

The backend enforces duplicate-registration, capacity, authorization, and past-event rules.

### GET `/registrations/me`
Returns the authenticated user's registrations.

### DELETE `/registrations/:eventId`
Cancels an existing registration when permitted.

## Administration

Administrative endpoints are protected by role-based authorization and are available only to administrators.

## Health

### GET `/health`
Returns API status.

Example response:

```json
{
  "success": true,
  "message": "CampusConnect API is running"
}
```

## Postman

The complete request collection is available under `postman/CampusConnect-API.json`.
