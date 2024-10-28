import Application from './application';
import Internship from './internship';
import Student from './student';
import Employer from './employer';

Employer.hasMany(Internship, { foreignKey: 'employerId' });
Internship.belongsTo(Employer, { foreignKey: 'employerId' });
Internship.hasMany(Application, { foreignKey: 'internshipId' });
Application.belongsTo(Internship, { foreignKey: 'internshipId' });
Application.belongsTo(Student, { foreignKey: 'studentId' });

export { Internship, Application, Employer, Student };
