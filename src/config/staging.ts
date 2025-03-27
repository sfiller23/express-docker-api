export default {
  env: "staging",
  port: process.env.PORT || 3000,
  dbUri: process.env.DB_URI || "mongodb://localhost/dev-db",
};
