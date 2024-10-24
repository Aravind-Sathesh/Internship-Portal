import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Student extends Model {
	public id!: number;
	public email!: string;
	public name!: string;
	public phoneNumber!: string;
	public address!: string;
	public bitsId!: string;
	public photoUrl?: string;
}

Student.init(
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
		bitsId: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		photoUrl: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		modelName: 'Student',
		tableName: 'students',
		timestamps: false,
	}
);

export default Student;
