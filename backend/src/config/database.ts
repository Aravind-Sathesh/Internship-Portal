import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
	process.env.DB_NAME as string,
	process.env.DB_USER as string,
	process.env.DB_PASSWORD as string,
	{
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT as 'mysql',
	}
);

export default sequelize;
