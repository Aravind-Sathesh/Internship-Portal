import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Employer from './employer';

class Internship extends Model {
	public id!: number;
	public role!: string;
	public description!: string;
	public employerId!: number;
	public deadline!: Date;
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

Internship.belongsTo(Employer, { foreignKey: 'employerId' });

export default Internship;
