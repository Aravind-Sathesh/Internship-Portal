import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
	'internship_portal',
	'internship_user',
	'Very-Strong-Database-Password',
	{
		host: 'localhost',
		dialect: 'mysql',
	}
);

export default sequelize;
