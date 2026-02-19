# Firebase Setup Guide

This guide explains how to set up Firebase for the NextCar project effectively.

## Prerequisites

1.  **Node.js**: Ensure you have Node.js installed (v18+ recommended).
2.  **Firebase CLI**: Install the Firebase CLI globally:
    ```bash
    npm install -g firebase-tools
    ```
3.  **Firebase Project**: Create a project in the [Firebase Console](https://console.firebase.google.com/).

## Local Development (Emulators)

To run the application with local Firebase emulators:

1.  **Login**:
    ```bash
    firebase login
    ```

2.  **Start Emulators**:
    From the root directory, run:
    ```bash
    firebase emulators:start
    ```
    This will start Firestore, Authentication, and Storage emulators.

3.  **Connect Apps**:
    Ensure your application code connects to the emulators when running in a development environment. This is typically handled in your Firebase initialization logic by checking `window.location.hostname === 'localhost'`.

## Configuration

1.  **Project Alias**:
    Update `.firebaserc` with your actual project ID:
    ```json
    {
      "projects": {
        "default": "your-actual-project-id"
      }
    }
    ```

2.  **Environment Variables**:
    Copy `.env.example` to `.env` in both `apps/admin` and `apps/frontend` and fill in your Firebase SDK configuration details found in the Firebase Console (Project Settings > General > Your apps).

## Deployment

To deploy manual rules or indexes:

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

To deploy specific apps (if hosting is configured), refer to the hosting configuration in `firebase.json`.
