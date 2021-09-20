const config = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || "localhost",
  DATABASE_URL: process.env.DATABASE_URL || "postgres://localhost:5432",
  DATABASE_NAME: process.env.DATABASE_NAME || "bookstore",
};

export default config;
