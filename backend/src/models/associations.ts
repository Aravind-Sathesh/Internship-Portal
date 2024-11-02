import Application from './application';
import Internship from './internship';
import Student from './student';
import Employer from './employer';

// To define the association between keys in the various tables of the database

Employer.hasMany(Internship, { foreignKey: 'employerId' });
Internship.belongsTo(Employer, { foreignKey: 'employerId' });
Internship.hasMany(Application, { foreignKey: 'internshipId' });
Application.belongsTo(Internship, { foreignKey: 'internshipId' });
Application.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(Application, { foreignKey: 'studentId' });

export { Internship, Application, Employer, Student };
