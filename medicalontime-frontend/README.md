# MedicalOnTime frontend

The React client. See the [README at the root of the repository](../README.md)
for what the application does, how authentication works and how to run both
halves together.

## Running it on its own

```bash
npm install
npm start
```

It serves on `http://localhost:3000` and expects the API on
`http://localhost:8080`. Point it elsewhere by copying `.env.example` to
`.env.local` and setting `REACT_APP_API_BASE_URL`.

The backend has to be running. Every screen behind the login reads from it.

## Where things are

```
src/
  services/
    api.js            the shared axios instance, token interceptor and 401 handling
    AuthService.js    sign in, sign up, the stored session
    MeService.js      the caller's own profile, appointments and treatment notes
    *Service.js       one per resource, all on top of api.js
  components/
    PrivateRoute.jsx  renders a screen only for a signed in account with the right role
    login/            sign in and sign up, sharing one CredentialsForm
    admin/            doctor directory, patient and appointment lists
    doctor/           own schedule, patient lookup, treatment notes
    patient/          own profile, booking, cancellation, doctor search
```

Bootstrapped with Create React App, so `npm test` and `npm run build` work as
usual.
