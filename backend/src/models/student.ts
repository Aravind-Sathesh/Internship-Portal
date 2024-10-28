import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Student extends Model {
	declare id: number;
	declare email: string;
	declare name: string;
	declare phoneNumber: string;
	declare address: string;
	declare bitsId: string;
	declare photoUrl: string;
}

Student.init(
	{
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
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
		hooks: {
			beforeCreate: (student: Student) => {
				const email = student.email;
				const idPart = email.match(/\d+/)?.[0];
				if (idPart) {
					student.id = parseInt(`411${idPart}`, 10);
				}
			},
		},
	}
);

export default Student;
