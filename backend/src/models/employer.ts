import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Employer extends Model {
	declare id: number;
	declare email: string;
	declare password: string;
	declare name: string;
	declare phoneNumber: string;
	declare address: string;
}

Employer.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phoneNumber: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Employer',
		tableName: 'employers',
		timestamps: false,
	}
);

export default Employer;
