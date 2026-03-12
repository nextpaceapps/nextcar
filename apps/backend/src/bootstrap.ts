import dotenv from 'dotenv';
import path from 'path';
import { initSentry } from './lib/sentry';

dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

initSentry();
