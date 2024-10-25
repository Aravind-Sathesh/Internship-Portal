import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Student from './student';
import Internship from './internship';

class Application extends Model {
	public id!: number;
	public studentId!: number;
	public internshipId!: number;
	public status!: string;
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
				'Under Review',
				'Interview Scheduled',
				'Offer Given',
				'Rejected',
				'Cancelled'
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

Application.belongsTo(Student, { foreignKey: 'studentId' });
Application.belongsTo(Internship, { foreignKey: 'internshipId' });

export default Application;
