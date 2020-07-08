export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mode: process.env.MODE || 'development',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
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
