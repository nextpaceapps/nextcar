import * as functions from 'firebase-functions/v1';
import app from './app';

export const api = functions.region('europe-west1').https.onRequest(app);
