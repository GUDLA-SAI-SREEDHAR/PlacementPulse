/**
 * Vercel Serverless Function Entry Point for PlacementPulse API
 * Forwards all /api/* requests to the Express backend
 */
const app = require('../backend/server');

module.exports = app;
