# MedicalOnTime

An appointment booking system for a clinic, with three kinds of account. A
patient books and cancels appointments and reads their own treatment history. A
doctor sees their own schedule, looks up a patient and writes treatment notes.
An admin manages the doctor directory and sees everything.

Spring Boot and MySQL on the back, React on the front.

---

## A note on what this is

The first version of this was a university project from late 2020. It had no
working authentication at all: the login screen asked for a password, never
checked it, fetched the record by id and navigated to the dashboard regardless.
Every API endpoint was open to anyone who could reach the port, passwords were
stored and returned as plain text, and the database password was committed in
`application.properties`.

I came back to it in 2026 and fixed that, because it is the kind of thing that
is worth showing rather than hiding. The rest of this README describes the
application as it stands now, and the last section lists what I would change
next and why I stopped where I did.

What changed:

- **Real authentication.** Spring Security, BCrypt password hashing, a login
  endpoint that issues a signed token and a filter that validates it.
- **Real authorisation.** Every endpoint now states who may call it, and the
  checks that depend on which row is being touched are enforced in the
  controllers rather than assumed.
- **No secrets in the repository.** The database password and the token signing
  key come from the environment. There is no default for either.
- **Passwords are never serialised.** The admin screens used to render a
  password column for every doctor and every patient. The field is write only
  now, so there is nothing to render.
- **The screens do something.** Most of the tables in the original were static
  markup over an empty array. They load real data.

---

## Running it

You need Java 11 or newer, Maven, Node 14 or newer, and MySQL.

**1. Create the database.**

```sql
CREATE DATABASE medical_on_time;
```

The schema is created on first run by Hibernate, so there is no migration to
apply.

**2. Configure and start the backend.**

```bash
cd medicalontime-backend
cp .env.example .env     # then fill in DB_PASSWORD and JWT_SECRET
./mvnw spring-boot:run
```

Every setting has an environment variable. `.env.example` lists them all with
comments. The two that matter:

| Variable | What it does |
| --- | --- |
| `DB_PASSWORD` | Your local MySQL password. No default. |
| `JWT_SECRET` | Signing key for access tokens, at least 32 characters. Leave it blank locally and a random key is generated for the run, which signs everyone out on restart. |

On an empty database the application creates the first admin account and prints
the username and a generated password to the log, once. Set `ADMIN_PASSWORD` if
you would rather choose it yourself.

**3. Start the frontend.**

```bash
cd medicalontime-frontend
npm install
npm start
```

It runs on `http://localhost:3000` and expects the API on
`http://localhost:8080`. Point it somewhere else with `REACT_APP_API_BASE_URL`
in a `.env.local` file.

**4. Sign in** as the admin, add a doctor, then register as a patient and book
something.

---

## How authentication works

The three account types live in three separate tables, which is inherited from
the original data model. A login request therefore says which role it is for,
because the same username could exist as both a patient and a doctor.

On a successful login the server returns a signed JSON Web Token carrying the
username, the role and the account id. The React client stores it and attaches
it to every subsequent request through a single axios interceptor, so there is
no way to add a new call and forget the header.

The API is stateless. There is no session and no session cookie, which is why
CSRF protection is switched off deliberately rather than by oversight: there is
nothing for a cross-site request to ride on.

### Who may call what

Two layers.

The rules that depend only on the role and the URL live in `SecurityConfig` and
are the coarse gate. A patient cannot reach an admin endpoint at all.

| Endpoint | Who |
| --- | --- |
| `POST /api/v1/auth/login`, `/auth/register` | Anyone |
| `GET /api/v1/me`, `/me/appointments`, `/me/descriptions` | Any signed in account, about itself |
| `/api/v1/admins/**` | Admin |
| `GET /api/v1/doctors/**` | Any signed in account |
| `POST` and `DELETE /api/v1/doctors/**` | Admin |
| `GET /api/v1/patients` | Admin, doctor |
| `GET` and `PUT /api/v1/patients/{id}` | Admin, doctor, or that patient |
| `GET /api/v1/appointments` | Admin, doctor |
| `/api/v1/appointments/{id}` | Admin, or the patient or doctor it is between |
| `GET /api/v1/descriptions` | Admin, doctor |
| `POST` and `PUT /api/v1/descriptions/**` | Doctor, for their own notes |

The checks that depend on which row is being asked for cannot be written as a
URL pattern, so they live in the controllers through a small `CurrentUser`
helper. One patient cannot read another patient. One doctor cannot edit another
doctor's treatment notes.

Where the identity is knowable from the token, it is not accepted from the
request body. Booking an appointment does not send a patient id and writing a
treatment note does not send a doctor id; the server fills both in. That removes
a whole class of request tampering rather than validating against it.

The `/me` endpoints exist for the same reason. A screen that shows "my
appointments" takes no id, so it cannot be pointed at somebody else's.

### What the guards on the frontend are for

`PrivateRoute` decides what renders, not what is permitted. Anyone can edit
their own browser storage and make a screen draw. What they cannot do is make
the API answer. The guard exists so a signed out visitor sees the login page
instead of an empty dashboard full of failed requests.

---

## Data model

Five tables. `admins`, `doctors`, `patients`, `appointments`, `descriptions`.

```
patients ──┐
           ├── appointments (id_patient, id_doctor, date, time)
doctors  ──┤
           └── descriptions (patient_name, treatment, note, id_doctor)
```

Two things about this are worth naming rather than leaving to be discovered.

**Accounts are split across three tables** instead of one users table with a
role column. That is why `AccountService` exists: something has to know which
table to look in. One table would be better, and the migration would touch every
controller, which is why it has not happened yet.

**Treatment notes reference the patient by name, not by id.** A patient reading
their own history is therefore a name match, and two patients with the same name
would see each other's notes. The write side works around it by choosing the
patient from a list rather than typing a name, but that is a workaround. The fix
is a foreign key.

---

## Layout

```
medicalontime-backend/
  src/main/java/com/medicalontime/springboot/
    auth/            login and registration endpoints
    controller/      one per entity, plus MeController for the caller's own data
    exception/       the exceptions the controllers throw and the JSON they become
    model/           the five JPA entities
    repository/      Spring Data interfaces
    security/        token service, filter, authorisation rules, account lookup

medicalontime-frontend/
  src/
    services/        api.js is the shared client, one service per resource
    components/
      login/         sign in and sign up
      admin/         doctor directory, patient and appointment lists
      doctor/        own schedule, patient lookup, treatment notes
      patient/       own profile, booking, cancellation, doctor search
```

---

## What I would do next

- **One users table.** Three tables for three account types is the source of the
  role parameter on login and of most of `AccountService`.
- **A foreign key on treatment notes.** See the data model section above. This
  is the one remaining correctness problem rather than a matter of taste.
- **The token in an httpOnly cookie** rather than in localStorage. What is here
  is the usual trade for a separately hosted single page app, and it is fine for
  a local run, but a cookie the page cannot read is the stronger answer.
- **Token refresh.** Tokens last two hours and there is no refresh, so a long
  session ends by being signed out rather than by renewing quietly.
- **Spring Boot 3 and a current MySQL driver.** The application is still on 2.4
  from the original build. The upgrade means moving every `javax.*` import to
  `jakarta.*`, which is mechanical but wide, and I did not want to mix it into
  the same change as the security work.
- **Tests.** There are none worth the name. The authorisation rules are exactly
  the kind of thing that should be pinned by tests, because a reordered matcher
  in `SecurityConfig` fails silently and opens an endpoint.
- **Appointment slots.** Nothing stops two patients booking the same doctor at
  the same time, because the original schema has no concept of availability.
