export default () => ({
  port: parseInt(process.env.APP_PORT, 10),
  mode: process.env.APP_MODE,
  googleMapsApiKey: process.env.APP_GOOGLE_MAPS_API_KEY,
  jwtSecret: process.env.APP_JWT_SECRET,
  jwtTokenExp: process.env.APP_JWT_TOKEN_EXPIRATION,
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  ldap: {
    host: process.env.LDAP_HOST,
    user: process.env.LDAP_USER,
    password: process.env.LDAP_USER_PASSWORD,
    certificate: process.env.LDAP_CERT_FILE,
  },
});
