import { Student, Course } from '../types';

export const defaultStudents: Omit<Student, 'id' | 'createdAt'>[] = [
  // ND1 Students
  { matricNumber: 'CFJ/ND/COM/2024/001', firstName: 'Abubakar', lastName: 'Muhammad', email: 'abubakar.muhammad@fcfj.edu.ng', department: 'Computer Science', level: 'ND1', phoneNumber: '+234 803 123 4567' },
  { matricNumber: 'CFJ/ND/COM/2024/002', firstName: 'Fatima', lastName: 'Ibrahim', email: 'fatima.ibrahim@fcfj.edu.ng', department: 'Computer Science', level: 'ND1', phoneNumber: '+234 805 234 5678' },
  { matricNumber: 'CFJ/ND/COM/2024/003', firstName: 'Emmanuel', lastName: 'Okafor', email: 'emmanuel.okafor@fcfj.edu.ng', department: 'Computer Science', level: 'ND1', phoneNumber: '+234 807 345 6789' },
  { matricNumber: 'CFJ/ND/COM/2024/004', firstName: 'Grace', lastName: 'Adebayo', email: 'grace.adebayo@fcfj.edu.ng', department: 'Computer Science', level: 'ND1', phoneNumber: '+234 809 456 7890' },
  { matricNumber: 'CFJ/ND/COM/2024/005', firstName: 'Usman', lastName: 'Aliyu', email: 'usman.aliyu@fcfj.edu.ng', department: 'Computer Science', level: 'ND1', phoneNumber: '+234 811 567 8901' },
  { matricNumber: 'CFJ/ND/COM/2024/006', firstName: 'Mary', lastName: 'Johnson', email: 'mary.johnson@fcfj.edu.ng', department: 'Computer Science', level: 'ND1', phoneNumber: '+234 813 678 9012' },
  { matricNumber: 'CFJ/ND/COM/2024/007', firstName: 'Abdullahi', lastName: 'Sani', email: 'abdullahi.sani@fcfj.edu.ng', department: 'Computer Science', level: 'ND1', phoneNumber: '+234 815 789 0123' },
  { matricNumber: 'CFJ/ND/COM/2024/008', firstName: 'Blessing', lastName: 'Okoro', email: 'blessing.okoro@fcfj.edu.ng', department: 'Computer Science', level: 'ND1', phoneNumber: '+234 817 890 1234' },
  { matricNumber: 'CFJ/ND/COM/2024/009', firstName: 'Musa', lastName: 'Garba', email: 'musa.garba@fcfj.edu.ng', department: 'Computer Science', level: 'ND1', phoneNumber: '+234 819 901 2345' },
  { matricNumber: 'CFJ/ND/COM/2024/010', firstName: 'Faith', lastName: 'Eze', email: 'faith.eze@fcfj.edu.ng', department: 'Computer Science', level: 'ND1', phoneNumber: '+234 821 012 3456' },

  // ND2 Students
  { matricNumber: 'CFJ/ND/COM/2023/001', firstName: 'Yusuf', lastName: 'Bello', email: 'yusuf.bello@fcfj.edu.ng', department: 'Computer Science', level: 'ND2', phoneNumber: '+234 823 123 4567' },
  { matricNumber: 'CFJ/ND/COM/2023/002', firstName: 'Zainab', lastName: 'Umar', email: 'zainab.umar@fcfj.edu.ng', department: 'Computer Science', level: 'ND2', phoneNumber: '+234 825 234 5678' },
  { matricNumber: 'CFJ/ND/COM/2023/003', firstName: 'David', lastName: 'Okonkwo', email: 'david.okonkwo@fcfj.edu.ng', department: 'Computer Science', level: 'ND2', phoneNumber: '+234 827 345 6789' },
  { matricNumber: 'CFJ/ND/COM/2023/004', firstName: 'Esther', lastName: 'Yakubu', email: 'esther.yakubu@fcfj.edu.ng', department: 'Computer Science', level: 'ND2', phoneNumber: '+234 829 456 7890' },
  { matricNumber: 'CFJ/ND/COM/2023/005', firstName: 'Ahmad', lastName: 'Musa', email: 'ahmad.musa@fcfj.edu.ng', department: 'Computer Science', level: 'ND2', phoneNumber: '+234 831 567 8901' },
  { matricNumber: 'CFJ/ND/COM/2023/006', firstName: 'Joy', lastName: 'Nwankwo', email: 'joy.nwankwo@fcfj.edu.ng', department: 'Computer Science', level: 'ND2', phoneNumber: '+234 833 678 9012' },
  { matricNumber: 'CFJ/ND/COM/2023/007', firstName: 'Ibrahim', lastName: 'Lawal', email: 'ibrahim.lawal@fcfj.edu.ng', department: 'Computer Science', level: 'ND2', phoneNumber: '+234 835 789 0123' },
  { matricNumber: 'CFJ/ND/COM/2023/008', firstName: 'Patience', lastName: 'Ogbonna', email: 'patience.ogbonna@fcfj.edu.ng', department: 'Computer Science', level: 'ND2', phoneNumber: '+234 837 890 1234' },

  // HND1 Students
  { matricNumber: 'CFJ/HND/COM/2024/001', firstName: 'Salisu', lastName: 'Abdullahi', email: 'salisu.abdullahi@fcfj.edu.ng', department: 'Computer Science', level: 'HND1', phoneNumber: '+234 839 901 2345' },
  { matricNumber: 'CFJ/HND/COM/2024/002', firstName: 'Hauwa', lastName: 'Yusuf', email: 'hauwa.yusuf@fcfj.edu.ng', department: 'Computer Science', level: 'HND1', phoneNumber: '+234 841 012 3456' },
  { matricNumber: 'CFJ/HND/COM/2024/003', firstName: 'Peter', lastName: 'Adamu', email: 'peter.adamu@fcfj.edu.ng', department: 'Computer Science', level: 'HND1', phoneNumber: '+234 843 123 4567' },
  { matricNumber: 'CFJ/HND/COM/2024/004', firstName: 'Ruth', lastName: 'Samuel', email: 'ruth.samuel@fcfj.edu.ng', department: 'Computer Science', level: 'HND1', phoneNumber: '+234 845 234 5678' },
  { matricNumber: 'CFJ/HND/COM/2024/005', firstName: 'Nasir', lastName: 'Ahmad', email: 'nasir.ahmad@fcfj.edu.ng', department: 'Computer Science', level: 'HND1', phoneNumber: '+234 847 345 6789' },
  { matricNumber: 'CFJ/HND/COM/2024/006', firstName: 'Mercy', lastName: 'Daniel', email: 'mercy.daniel@fcfj.edu.ng', department: 'Computer Science', level: 'HND1', phoneNumber: '+234 849 456 7890' },

  // HND2 Students
  { matricNumber: 'CFJ/HND/COM/2023/001', firstName: 'Aminu', lastName: 'Hassan', email: 'aminu.hassan@fcfj.edu.ng', department: 'Computer Science', level: 'HND2', phoneNumber: '+234 851 567 8901' },
  { matricNumber: 'CFJ/HND/COM/2023/002', firstName: 'Khadija', lastName: 'Suleiman', email: 'khadija.suleiman@fcfj.edu.ng', department: 'Computer Science', level: 'HND2', phoneNumber: '+234 853 678 9012' },
  { matricNumber: 'CFJ/HND/COM/2023/003', firstName: 'John', lastName: 'Musa', email: 'john.musa@fcfj.edu.ng', department: 'Computer Science', level: 'HND2', phoneNumber: '+234 855 789 0123' },
  { matricNumber: 'CFJ/HND/COM/2023/004', firstName: 'Sarah', lastName: 'Ibrahim', email: 'sarah.ibrahim@fcfj.edu.ng', department: 'Computer Science', level: 'HND2', phoneNumber: '+234 857 890 1234' },
];

export const defaultCourses: Omit<Course, 'id' | 'createdAt'>[] = [
  // ND1 Courses
  { code: 'COM 101', title: 'Introduction to Computer Science', creditUnit: 3, lecturer: 'Dr. Aisha Mahmud', department: 'Computer Science', level: 'ND1', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 102', title: 'Computer Programming I', creditUnit: 4, lecturer: 'Mr. Emmanuel Okafor', department: 'Computer Science', level: 'ND1', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 103', title: 'Mathematics for Computer Science', creditUnit: 3, lecturer: 'Dr. Fatima Aliyu', department: 'Computer Science', level: 'ND1', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 104', title: 'Digital Logic Design', creditUnit: 3, lecturer: 'Eng. David Yakubu', department: 'Computer Science', level: 'ND1', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 111', title: 'Computer Programming II', creditUnit: 4, lecturer: 'Mr. Emmanuel Okafor', department: 'Computer Science', level: 'ND1', semester: 'Second Semester', session: '2024/2025' },
  { code: 'COM 112', title: 'Data Structures', creditUnit: 3, lecturer: 'Dr. Grace Adebayo', department: 'Computer Science', level: 'ND1', semester: 'Second Semester', session: '2024/2025' },

  // ND2 Courses
  { code: 'COM 201', title: 'Object Oriented Programming', creditUnit: 4, lecturer: 'Dr. Yusuf Bello', department: 'Computer Science', level: 'ND2', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 202', title: 'Database Management Systems', creditUnit: 3, lecturer: 'Mr. Ahmad Musa', department: 'Computer Science', level: 'ND2', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 203', title: 'Computer Networks', creditUnit: 3, lecturer: 'Eng. Ibrahim Lawal', department: 'Computer Science', level: 'ND2', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 204', title: 'Web Development', creditUnit: 3, lecturer: 'Ms. Zainab Umar', department: 'Computer Science', level: 'ND2', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 211', title: 'Software Engineering', creditUnit: 3, lecturer: 'Dr. David Okonkwo', department: 'Computer Science', level: 'ND2', semester: 'Second Semester', session: '2024/2025' },
  { code: 'COM 212', title: 'Mobile App Development', creditUnit: 3, lecturer: 'Mr. Peter Adamu', department: 'Computer Science', level: 'ND2', semester: 'Second Semester', session: '2024/2025' },

  // HND1 Courses
  { code: 'COM 301', title: 'Advanced Programming', creditUnit: 4, lecturer: 'Dr. Salisu Abdullahi', department: 'Computer Science', level: 'HND1', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 302', title: 'System Analysis and Design', creditUnit: 3, lecturer: 'Dr. Hauwa Yusuf', department: 'Computer Science', level: 'HND1', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 303', title: 'Computer Graphics', creditUnit: 3, lecturer: 'Mr. Nasir Ahmad', department: 'Computer Science', level: 'HND1', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 311', title: 'Artificial Intelligence', creditUnit: 3, lecturer: 'Dr. Ruth Samuel', department: 'Computer Science', level: 'HND1', semester: 'Second Semester', session: '2024/2025' },

  // HND2 Courses
  { code: 'COM 401', title: 'Project Management', creditUnit: 3, lecturer: 'Dr. Aminu Hassan', department: 'Computer Science', level: 'HND2', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 402', title: 'Cybersecurity', creditUnit: 3, lecturer: 'Eng. Khadija Suleiman', department: 'Computer Science', level: 'HND2', semester: 'First Semester', session: '2024/2025' },
  { code: 'COM 411', title: 'Final Year Project', creditUnit: 6, lecturer: 'Dr. John Musa', department: 'Computer Science', level: 'HND2', semester: 'Second Semester', session: '2024/2025' },
];