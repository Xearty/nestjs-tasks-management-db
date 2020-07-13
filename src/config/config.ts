export const config = () => ({
  nodeEnv: process.env.NODE_ENV,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: Number(process.env.JWT_EXPIRES_IN),
  },
  port: Number(process.env.PORT),
  database: {
    type: 'postgres',
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.TYPEORM_SYNC === 'true',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
  }
})
