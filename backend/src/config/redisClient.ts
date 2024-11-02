import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = new Redis({
	host: process.env.REDIS_HOST,
	port: parseInt(process.env.REDIS_PORT as string),
});

export default redisClient;
