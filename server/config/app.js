module.exports = {
  APP_NAME: process.env.APP_NAME || 'Swept',
  PORT: parseInt(process.env.PORT, 10) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ROLES: {
    HOST: 'host',
    CLEANER: 'cleaner',
  },
};
