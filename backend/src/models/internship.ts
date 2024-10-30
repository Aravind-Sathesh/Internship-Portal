import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Employer from './employer';
import Application from './application';

class Internship extends Model {
	declare id: number;
	declare role: string;
	declare description: string;
	declare employerId: number;
	declare deadline: Date;
	declare is_active: boolean;
}

Internship.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		employerId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		deadline: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Internship',
		tableName: 'internships',
		timestamps: false,
	}
);

export default Internship;
