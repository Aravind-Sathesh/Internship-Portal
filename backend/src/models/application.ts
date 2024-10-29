import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Internship from './internship';
import Student from './student';

class Application extends Model {
	declare id: number;
	declare studentId: number;
	declare internshipId: number;
	declare status:
		| 'Applied'
		| 'Interview Scheduled'
		| 'Offer Given'
		| 'Rejected'
		| 'Withdrawn'
		| 'Accepted';
}

Application.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		studentId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		internshipId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM(
				'Applied',
				'Interview Scheduled',
				'Offer Given',
				'Rejected',
				'Withdrawn',
				'Accepted'
			),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Application',
		tableName: 'applications',
		timestamps: false,
	}
);

export default Application;
