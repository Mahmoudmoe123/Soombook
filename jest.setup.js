// Adds DOM matchers such as toBeInTheDocument() to every test.
import "@testing-library/jest-dom";

// Keep test output readable: API routes log every request. The logger tests turn logging back on.
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "silent";
