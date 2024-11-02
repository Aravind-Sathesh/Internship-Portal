import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Establish connection with MySQL Database
const sequelize = new Sequelize(
	process.env.DB_NAME as string,
	process.env.DB_USER as string,
	process.env.DB_PASSWORD as string,
	{
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT as string),
		dialect: process.env.DB_DIALECT as 'mysql',
	}
);

export default sequelize;
