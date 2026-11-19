import serverless from 'serverless-http';
import importedApp from '../../src/app.js';

// After Netlify bundles this file, the import above can arrive as a module
// namespace object ({ default: app }) instead of the Express app itself.
// Unwrap it so `app` is always the real Express app.
const app = importedApp?.default ?? importedApp;

// Pass a plain (req, res) handler so serverless-http does not need to
// detect the framework from the app object.
export const handler = serverless((req, res) => app(req, res));
