const pkg = require("./generated/prisma/index.js");

const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
});

module.exports = prisma;
