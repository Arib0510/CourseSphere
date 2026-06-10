-- =============================================
-- Seed Data for Course Registration System
-- =============================================

-- Insert sample courses
-- 1st Year Odd Semester

INSERT INTO courses (course_no, course_title, credits, credit_hours, academic_year, semester) VALUES
('ETE 1110', 'Engineering Graphics and Design', 1.50, 3.00, '1st Year', 'Odd'),
('ETE 1111', 'Electrical Circuit Theory', 3.00, 3.00, '1st Year', 'Odd'),
('ETE 1112', 'Sessional Based on ETE 1111', 1.50, 3.00, '1st Year', 'Odd'),
('ETE 1113', 'Computer Fundamentals and Programming', 3.00, 3.00, '1st Year', 'Odd'),
('ETE 1114', 'Sessional Based on ETE 1113', 1.50, 3.00, '1st Year', 'Odd'),
('PHY 1115', 'Physics', 3.00, 3.00, '1st Year', 'Odd'),
('PHY 1116', 'Sessional Based on PHY 1115', 0.75, 1.50, '1st Year', 'Odd'),
('MATH 1115', 'Calculus and Differential Equations', 3.00, 3.00, '1st Year', 'Odd'),
('HUM 1115', 'Communicative English', 2.00, 2.00, '1st Year', 'Odd'),
('HUM 1116', 'English Language Lab', 0.75, 1.50, '1st Year', 'Odd');

-- 1st Year Even Semester

INSERT INTO courses (course_no, course_title, credits, credit_hours, academic_year, semester) VALUES
('ETE 1211', 'Analog Electronics-I', 3.00, 3.00, '1st Year', 'Even'),
('ETE 1212', 'Sessional Based on ETE 1211', 1.50, 3.00, '1st Year', 'Even'),
('ETE 1213', 'Digital Electronics', 3.00, 3.00, '1st Year', 'Even'),
('ETE 1214', 'Sessional Based on ETE 1213', 1.50, 3.00, '1st Year', 'Even'),
('CSE 1254', 'Object Oriented Programming Lab', 1.50, 3.00, '1st Year', 'Even'),
('EEE 1253', 'Electrical Machine', 3.00, 3.00, '1st Year', 'Even'),
('EEE 1254', 'Sessional Based on EEE 1253', 0.75, 1.50, '1st Year', 'Even'),
('MATH 1215', 'Linear Algebra & Three-Dimensional Geometry', 3.00, 3.00, '1st Year', 'Even'),
('HUM 1215', 'Financial Accounts & Economic Analysis', 3.00, 3.00, '1st Year', 'Even');

-- 2nd Year Odd Semester

INSERT INTO courses (course_no, course_title, credits, credit_hours, academic_year, semester) VALUES
('ETE 2110', 'Electronic Circuit Design and Simulation Lab', 1.50, 3.00, '2nd Year', 'Odd'),
('ETE 2111', 'Analog Electronics-II', 3.00, 3.00, '2nd Year', 'Odd'),
('ETE 2112', 'Sessional Based on ETE 2111', 1.50, 3.00, '2nd Year', 'Odd'),
('ETE 2113', 'Analog Communication', 3.00, 3.00, '2nd Year', 'Odd'),
('ETE 2114', 'Sessional Based on ETE 2113', 1.50, 3.00, '2nd Year', 'Odd'),
('ETE 2115', 'Signal and System', 3.00, 3.00, '2nd Year', 'Odd'),
('ETE 2116', 'Sessional Based on ETE 2115', 0.75, 1.50, '2nd Year', 'Odd'),
('CSE 2153', 'Data Structure and Algorithm', 3.00, 3.00, '2nd Year', 'Odd'),
('CSE 2154', 'Sessional Based on CSE 2153', 1.50, 3.00, '2nd Year', 'Odd'),
('MATH 2115', 'Transform Techniques and Partial Differential Equations', 3.00, 3.00, '2nd Year', 'Odd');

-- 2nd Year Even Semester

INSERT INTO courses (course_no, course_title, credits, credit_hours, academic_year, semester) VALUES
('ETE 2200', 'Project Design and Development-I', 1.50, 3.00, '2nd Year', 'Even'),
('ETE 2211', 'Power Electronics', 3.00, 3.00, '2nd Year', 'Even'),
('ETE 2212', 'Sessional Based on ETE 2211', 0.75, 1.50, '2nd Year', 'Even'),
('ETE 2213', 'EM Fields and Waves', 3.00, 3.00, '2nd Year', 'Even'),
('CSE 2253', 'Database Management System', 3.00, 3.00, '2nd Year', 'Even'),
('CSE 2254', 'Sessional Based on CSE 2253', 1.50, 3.00, '2nd Year', 'Even'),
('MATH 2215', 'Complex Variable and Statistical Analysis', 3.00, 3.00, '2nd Year', 'Even'),
('HUM 2215', 'Engineering Ethics and Sociology', 3.00, 3.00, '2nd Year', 'Even');

-- 3rd Year Odd Semester

INSERT INTO courses (course_no, course_title, credits, credit_hours, academic_year, semester) VALUES
('ETE 3111', 'Digital Communication', 3.00, 3.00, '3rd Year', 'Odd'),
('ETE 3112', 'Sessional Based on ETE 3111', 0.75, 1.50, '3rd Year', 'Odd'),
('ETE 3113', 'Microwave Engineering', 3.00, 3.00, '3rd Year', 'Odd'),
('ETE 3114', 'Sessional Based on ETE 3113', 0.75, 1.50, '3rd Year', 'Odd'),
('ETE 3115', 'Numerical Methods in Engineering', 3.00, 3.00, '3rd Year', 'Odd'),
('ETE 3116', 'Sessional Based on ETE 3115', 0.75, 1.50, '3rd Year', 'Odd'),
('ETE 3117', 'Control System', 3.00, 3.00, '3rd Year', 'Odd'),
('ETE 3118', 'Sessional Based on ETE 3117', 0.75, 1.50, '3rd Year', 'Odd'),
('EEE 3153', 'Power System', 3.00, 3.00, '3rd Year', 'Odd'),
('EEE 3154', 'Sessional Based on EEE 3153', 0.75, 1.50, '3rd Year', 'Odd'),
('CSE 3154', 'Web Programming', 1.50, 3.00, '3rd Year', 'Odd');

-- 3rd Year Even Semester

INSERT INTO courses (course_no, course_title, credits, credit_hours, academic_year, semester) VALUES
('ETE 3200', 'Project Design and Development-II', 1.50, 3.00, '3rd Year', 'Even'),
('ETE 3211', 'Fiber Optic Communication', 3.00, 3.00, '3rd Year', 'Even'),
('ETE 3212', 'Sessional Based on ETE 3211', 0.75, 1.50, '3rd Year', 'Even'),
('ETE 3213', 'Antennas and Propagation', 3.00, 3.00, '3rd Year', 'Even'),
('ETE 3214', 'Sessional Based on ETE 3213', 0.75, 1.50, '3rd Year', 'Even'),
('ETE 3215', 'Digital Signal Processing', 3.00, 3.00, '3rd Year', 'Even'),
('ETE 3216', 'Sessional Based on ETE 3215', 0.75, 1.50, '3rd Year', 'Even'),
('ETE 3217', 'Information Theory', 3.00, 3.00, '3rd Year', 'Even'),
('ETE 3218', 'Seminar', 0.75, 1.50, '3rd Year', 'Even'),
('ETE 3219', 'Elective-I (Placeholder)', 3.00, 3.00, '3rd Year', 'Even'),
('ETE 3220', 'Sessional Based on Elective-I (Placeholder)', 0.75, 1.50, '3rd Year', 'Even');

-- 4th Year Odd Semester

INSERT INTO courses (course_no, course_title, credits, credit_hours, academic_year, semester) VALUES
('ETE 4100', 'Project and Thesis', 1.50, 3.00, '4th Year', 'Odd'),
('ETE 4111', 'Wireless and Mobile Communications', 3.00, 3.00, '4th Year', 'Odd'),
('ETE 4112', 'Sessional Based on ETE 4111', 0.75, 1.50, '4th Year', 'Odd'),
('ETE 4113', 'VLSI Design', 3.00, 3.00, '4th Year', 'Odd'),
('ETE 4114', 'Sessional Based on ETE 4113', 0.75, 1.50, '4th Year', 'Odd'),
('ETE 4115', 'Microprocessor and Interfacing', 3.00, 3.00, '4th Year', 'Odd'),
('ETE 4116', 'Sessional Based on ETE 4115', 0.75, 1.50, '4th Year', 'Odd'),
('ETE 4117', 'Computer Networks', 3.00, 3.00, '4th Year', 'Odd'),
('ETE 4118', 'Sessional Based on ETE 4117', 0.75, 1.50, '4th Year', 'Odd'),
('ETE 4120', 'Industrial Training', 0.75, 1.50, '4th Year', 'Odd'),
('ETE 4119', 'Elective-II (Placeholder)', 3.00, 3.00, '4th Year', 'Odd');

-- 4th Year Even Semester

INSERT INTO courses (course_no, course_title, credits, credit_hours, academic_year, semester) VALUES
('ETE 4200', 'Project and Thesis', 2.50, 5.00, '4th Year', 'Even'),
('ETE 4211', 'Telecommunication Engineering', 3.00, 3.00, '4th Year', 'Even'),
('ETE 4212', 'Sessional Based on ETE 4211', 0.75, 1.50, '4th Year', 'Even'),
('ETE 4213', 'Satellite Communication and Radar', 3.00, 3.00, '4th Year', 'Even'),
('ETE 4214', 'Sessional Based on ETE 4213', 0.75, 1.50, '4th Year', 'Even'),
('ETE 4215', 'Machine Learning', 3.00, 3.00, '4th Year', 'Even'),
('ETE 4216', 'Sessional Based on ETE 4215', 0.75, 1.50, '4th Year', 'Even'),
('ETE 4218', 'Elective-III (Placeholder)', 3.00, 3.00, '4th Year', 'Even'),
('HUM 4215', 'Project Management and Legal Issues', 3.00, 3.00, '4th Year', 'Even');

-- Elective-I Courses

INSERT INTO courses (course_no, course_title, credits, credit_hours, category) VALUES
('ETE 3221', 'Microwave Devices', 3.00, 3.00, 'Elective-I'),
('ETE 3222', 'Sessional Based on ETE 3221', 0.75, 1.50, 'Elective-I'),
('ETE 3223', 'Cellular Communication', 3.00, 3.00, 'Elective-I'),
('ETE 3224', 'Sessional Based on ETE 3223', 0.75, 1.50, 'Elective-I'),
('ETE 3225', 'Digital Image Processing', 3.00, 3.00, 'Elective-I'),
('ETE 3226', 'Sessional Based on ETE 3225', 0.75, 1.50, 'Elective-I'),
('ETE 3237', 'Digital Speech Processing', 3.00, 3.00, 'Elective-I'),
('ETE 3238', 'Sessional Based on ETE 3237', 0.75, 1.50, 'Elective-I'),
('ETE 3229', 'Renewable Energy', 3.00, 3.00, 'Elective-I'),
('ETE 3230', 'Sessional Based on ETE 3229', 0.75, 1.50, 'Elective-I'),
('ETE 3231', 'Measurement, Instrumentation and Sensors Applications', 3.00, 3.00, 'Elective-I'),
('ETE 3232', 'Sessional Based on ETE 3231', 0.75, 1.50, 'Elective-I'),
('ETE 3233', 'TV Engineering', 3.00, 3.00, 'Elective-I'),
('ETE 3234', 'Sessional Based on ETE 3233', 0.75, 1.50, 'Elective-I'),
('ETE 3235', 'Web Engineering', 3.00, 3.00, 'Elective-I'),
('ETE 3236', 'Sessional Based on ETE 3235', 0.75, 1.50, 'Elective-I');

-- Elective-II Courses

INSERT INTO courses (course_no, course_title, credits, credit_hours, category) VALUES
('ETE 4121', 'Multimedia Communication', 3.00, 3.00, 'Elective-II'),
('ETE 4123', 'Biomedical Engineering', 3.00, 3.00, 'Elective-II'),
('ETE 4125', 'Radio Wave Propagation', 3.00, 3.00, 'Elective-II'),
('ETE 4127', 'Spread Spectrum and CDMA Technology', 3.00, 3.00, 'Elective-II'),
('ETE 4129', 'Discrete Mathematics', 3.00, 3.00, 'Elective-II'),
('ETE 4131', 'Graph Theory', 3.00, 3.00, 'Elective-II'),
('ETE 4133', 'Optoelectronics', 3.00, 3.00, 'Elective-II'),
('ETE 4135', 'Processing and Fabrication Technology', 3.00, 3.00, 'Elective-II'),
('ETE 4137', 'Random Signal Processing', 3.00, 3.00, 'Elective-II'),
('ETE 4139', 'Data Science', 3.00, 3.00, 'Elective-II');

-- Elective-III Courses

INSERT INTO courses (course_no, course_title, credits, credit_hours, category) VALUES
('ETE 4217', 'Internet of Things (IoT)', 3.00, 3.00, 'Elective-III'),
('ETE 4219', 'Advanced Solid-State Devices', 3.00, 3.00, 'Elective-III'),
('ETE 4221', 'Microcontroller and Embedded System', 3.00, 3.00, 'Elective-III'),
('ETE 4223', 'Engineering Materials', 3.00, 3.00, 'Elective-III'),
('ETE 4225', 'Neural Network & Fuzzy Systems', 3.00, 3.00, 'Elective-III'),
('ETE 4227', 'Operating System', 3.00, 3.00, 'Elective-III'),
('ETE 4229', 'Software Engineering', 3.00, 3.00, 'Elective-III'),
('ETE 4231', 'Machine Vision', 3.00, 3.00, 'Elective-III'),
('ETE 4233', 'ICT Security', 3.00, 3.00, 'Elective-III');

-- Insert a default admin (update this email to your admin account)
INSERT INTO admins (email) VALUES
    ('admin@university.edu')
ON CONFLICT (email) DO NOTHING;
