// Vercel serverless handler for Express app
// This wraps the Express app to work with Vercel's serverless functions

const app = require('../dist/app').default;

// Export the Express app as a Vercel serverless function
module.exports = app;
