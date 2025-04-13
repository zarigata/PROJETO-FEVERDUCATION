/*
/////////////////////////////////////////////////////////////////////////////
//                                                                         //
//  [FEVERDUCATION] - Database Seed Script                                 //
//  ---------------------------------------------------------------        //
//  This script populates the PostgreSQL database with demonstration       //
//  data for development and testing purposes.                             //
//                                                                         //
//  CODEX LEVEL: ALPHA-7                                                   //
//  VERSION: 1.0.0                                                         //
//  PLATFORM: CROSS-COMPATIBLE (WIN/LINUX)                                 //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
*/

-- Clear existing data if needed (for development only)
TRUNCATE TABLE users, teachers, students, classes, class_students, modules, lessons,
             materials, assignments, submissions, attendances, grades, activities, 
             generated_content CASCADE;

-- Insert sample users (passwords would be hashed in a real application)
INSERT INTO users (id, email, password, name, avatar, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'jane.doe@fevereducation.com', 'password', 'Jane Doe', '/avatars/jane.jpg', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'john.smith@fevereducation.com', 'password', 'John Smith', '/avatars/john.jpg', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'alice.johnson@fevereducation.com', 'password', 'Alice Johnson', '/avatars/alice.jpg', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'bob.williams@fevereducation.com', 'password', 'Bob Williams', '/avatars/bob.jpg', NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', 'carol.davis@fevereducation.com', 'password', 'Carol Davis', NULL, NOW(), NOW()),
('00000000-0000-0000-0000-000000000006', 'david.miller@fevereducation.com', 'password', 'David Miller', NULL, NOW(), NOW()),
('00000000-0000-0000-0000-000000000007', 'emma.wilson@fevereducation.com', 'password', 'Emma Wilson', NULL, NOW(), NOW()),
('00000000-0000-0000-0000-000000000008', 'frank.jones@fevereducation.com', 'password', 'Frank Jones', NULL, NOW(), NOW()),
('00000000-0000-0000-0000-000000000009', 'grace.taylor@fevereducation.com', 'password', 'Grace Taylor', NULL, NOW(), NOW()),
('00000000-0000-0000-0000-000000000010', 'henry.brown@fevereducation.com', 'password', 'Henry Brown', NULL, NOW(), NOW());

-- Insert teachers
INSERT INTO teachers (id, user_id, bio, subjects, years_of_exp, institution, department) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Experienced science educator with a passion for interactive learning.', ARRAY['Biology', 'Chemistry'], 8, 'FeverEducation High School', 'Science'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Mathematics specialist focused on making complex concepts accessible.', ARRAY['Mathematics', 'Physics'], 12, 'FeverEducation High School', 'Mathematics');

-- Insert students
INSERT INTO students (id, user_id, grade_level, bio) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'High School', 'Enthusiastic learner interested in science and technology.'),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'High School', 'Curious student with a focus on mathematics and computer science.'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'High School', 'Creative thinker who enjoys connecting different subjects.'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', 'High School', 'Detailed-oriented student with interest in laboratory sciences.'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000007', 'High School', 'Analytical thinker who loves solving challenging problems.'),
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000008', 'High School', 'Collaborative learner who thrives in group projects.'),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000009', 'High School', 'Visual learner who excels with graphical representations.'),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000010', 'High School', 'Self-motivated student focused on academic excellence.');

-- Insert classes
INSERT INTO classes (id, name, subject, description, start_date, end_date, schedule, teacher_id, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Biology 101', 'Biology', 'Introductory biology course covering cellular structures, genetics, and basic ecological principles.', '2025-01-15', '2025-06-15', '{"days": ["Monday", "Wednesday"], "time": "10:00 AM"}', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'Chemistry Basics', 'Chemistry', 'Fundamental chemistry concepts including atomic structure, chemical bonding, and basic reactions.', '2025-01-15', '2025-06-15', '{"days": ["Tuesday", "Thursday"], "time": "1:30 PM"}', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'Advanced Mathematics', 'Mathematics', 'Higher-level mathematics including calculus, linear algebra, and probability theory.', '2025-01-15', '2025-06-15', '{"days": ["Monday", "Wednesday", "Friday"], "time": "9:15 AM"}', '00000000-0000-0000-0000-000000000002', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'Physics Fundamentals', 'Physics', 'Introduction to physics principles including mechanics, thermodynamics, and electromagnetism.', '2025-01-15', '2025-06-15', '{"days": ["Tuesday", "Thursday"], "time": "11:00 AM"}', '00000000-0000-0000-0000-000000000002', NOW(), NOW());

-- Assign students to classes
INSERT INTO class_students (id, class_id, student_id, joined_at) VALUES
-- Biology 101
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', NOW()),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', NOW()),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', NOW()),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', NOW()),
-- Chemistry Basics
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', NOW()),
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', NOW()),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', NOW()),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', NOW()),
-- Advanced Mathematics
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', NOW()),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', NOW()),
('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', NOW()),
('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', NOW()),
-- Physics Fundamentals
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', NOW()),
('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', NOW()),
('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000008', NOW());

-- Insert modules
INSERT INTO modules (id, title, description, order, class_id) VALUES
-- Biology 101 modules
('00000000-0000-0000-0000-000000000001', 'Cell Structure and Function', 'Exploration of cellular components and their roles in biological processes.', 1, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', 'Genetics and Inheritance', 'Study of DNA, genes, chromosomes, and patterns of inheritance.', 2, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000003', 'Ecology and Ecosystems', 'Examination of relationships between organisms and their environment.', 3, '00000000-0000-0000-0000-000000000001'),
-- Chemistry Basics modules
('00000000-0000-0000-0000-000000000004', 'Atomic Structure', 'Understanding the building blocks of matter and atomic models.', 1, '00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000005', 'Chemical Bonding', 'Exploration of how atoms combine to form molecules.', 2, '00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000006', 'Periodic Table', 'Study of elements and their properties based on the periodic table.', 3, '00000000-0000-0000-0000-000000000002'),
-- Advanced Mathematics modules
('00000000-0000-0000-0000-000000000007', 'Calculus Fundamentals', 'Introduction to limits, derivatives, and integrals.', 1, '00000000-0000-0000-0000-000000000003'),
('00000000-0000-0000-0000-000000000008', 'Linear Algebra', 'Study of vectors, matrices, and linear transformations.', 2, '00000000-0000-0000-0000-000000000003'),
('00000000-0000-0000-0000-000000000009', 'Probability Theory', 'Analysis of random events and statistical patterns.', 3, '00000000-0000-0000-0000-000000000003'),
-- Physics Fundamentals modules
('00000000-0000-0000-0000-000000000010', 'Mechanics', 'Study of motion, forces, and energy.', 1, '00000000-0000-0000-0000-000000000004'),
('00000000-0000-0000-0000-000000000011', 'Thermodynamics', 'Exploration of heat, temperature, and energy transfer.', 2, '00000000-0000-0000-0000-000000000004'),
('00000000-0000-0000-0000-000000000012', 'Electricity and Magnetism', 'Study of electrical charges, currents, and magnetic fields.', 3, '00000000-0000-0000-0000-000000000004');

-- Insert lessons (just a few examples)
INSERT INTO lessons (id, title, content, duration, module_id, class_id, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Introduction to Cells', '# Introduction to Cells\n\nCells are the basic unit of life. In this lesson, we will explore cell structure, organelles, and the differences between prokaryotic and eukaryotic cells.', 45, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'Cell Membrane and Transport', '# Cell Membrane and Transport\n\nThe cell membrane is a selective barrier that regulates what enters and exits the cell. We will study membrane structure and various transport mechanisms.', 45, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'Atomic Models', '# Atomic Models\n\nAtoms are the building blocks of matter. This lesson covers the historical development of atomic models from Dalton to modern quantum mechanical models.', 45, '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'Derivatives Introduction', '# Introduction to Derivatives\n\nDerivatives measure the rate of change of a function. We will explore the concept, notation, and basic rules of differentiation.', 45, '00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', NOW(), NOW()),
('00000000-0000-0000-0000-000000000005', 'Newton\'s Laws of Motion', '# Newton\'s Laws of Motion\n\nNewton\'s three laws form the foundation of classical mechanics. We will study each law and its applications to everyday phenomena.', 45, '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000004', NOW(), NOW());

-- Insert generated content examples (AI-generated lessons, quizzes, etc.)
INSERT INTO generated_content (id, type, content, prompt, metadata, teacher_id, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'LESSON_PLAN', '# Photosynthesis\n\n## Learning Objectives\n- Understand the basic process of photosynthesis\n- Identify key components involved\n- Explain the importance for life on Earth\n\n## Key Concepts\nPhotosynthesis converts light energy into chemical energy in plants, algae, and some bacteria.\n\n## Activities\n1. Observe leaves under microscope\n2. Demonstrate oxygen production\n3. Create process diagrams', 'Create a lesson plan about photosynthesis for high school biology', '{"subject": "Biology", "grade": "High School", "duration": 45}', '00000000-0000-0000-0000-000000000001', NOW()),
('00000000-0000-0000-0000-000000000002', 'QUIZ', '# Chemistry Quiz: Atomic Structure\n\n1. What is the atomic number?\n   a) Number of protons\n   b) Number of neutrons\n   c) Number of electrons\n   d) Sum of protons and neutrons\n\n2. Who proposed the quantum mechanical model?\n   a) Niels Bohr\n   b) Erwin Schrödinger\n   c) J.J. Thomson\n   d) John Dalton', 'Create a quiz about atomic structure for high school chemistry', '{"subject": "Chemistry", "grade": "High School", "questionCount": 10}', '00000000-0000-0000-0000-000000000001', NOW()),
('00000000-0000-0000-0000-000000000003', 'HANDOUT', '# Calculus: Derivatives Cheat Sheet\n\n## Basic Rules\n- Power Rule: d/dx(x^n) = nx^(n-1)\n- Product Rule: d/dx(fg) = f\'g + fg\'\n- Quotient Rule: d/dx(f/g) = (f\'g - fg\')/g^2\n- Chain Rule: d/dx(f(g(x))) = f\'(g(x)) · g\'(x)\n\n## Common Derivatives\n- d/dx(sin x) = cos x\n- d/dx(cos x) = -sin x\n- d/dx(e^x) = e^x\n- d/dx(ln x) = 1/x', 'Create a handout on calculus derivatives', '{"subject": "Mathematics", "grade": "High School"}', '00000000-0000-0000-0000-000000000002', NOW());

-- Insert attendance records (with some variability to show patterns)
INSERT INTO attendances (id, date, status, notes, student_id) VALUES
-- Student 1 (mostly present)
('00000000-0000-0000-0000-000000000001', '2025-04-01', 'PRESENT', NULL, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', '2025-04-03', 'PRESENT', NULL, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000003', '2025-04-08', 'PRESENT', NULL, '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000004', '2025-04-10', 'ABSENT', 'Doctor appointment', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000005', '2025-04-15', 'PRESENT', NULL, '00000000-0000-0000-0000-000000000001'),
-- Student 2 (always present)
('00000000-0000-0000-0000-000000000006', '2025-04-01', 'PRESENT', NULL, '00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000007', '2025-04-03', 'PRESENT', NULL, '00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000008', '2025-04-08', 'PRESENT', NULL, '00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000009', '2025-04-10', 'PRESENT', NULL, '00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000010', '2025-04-15', 'PRESENT', NULL, '00000000-0000-0000-0000-000000000002');

-- Insert sample activity records for student engagement tracking
INSERT INTO activities (id, type, description, timestamp, student_id) VALUES
('00000000-0000-0000-0000-000000000001', 'QUESTION', 'Asked about cell membrane function', '2025-04-01 10:15:00', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', 'PARTICIPATION', 'Contributed to class discussion on genetics', '2025-04-03 10:30:00', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000003', 'HOMEWORK', 'Submitted biology homework on time', '2025-04-05 23:00:00', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000004', 'QUESTION', 'Asked clarifying question about derivatives', '2025-04-02 09:20:00', '00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000005', 'PARTICIPATION', 'Solved math problem on the board', '2025-04-03 09:45:00', '00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000006', 'HOMEWORK', 'Submitted detailed math assignment', '2025-04-07 22:30:00', '00000000-0000-0000-0000-000000000002');

-- Insert assignments
INSERT INTO assignments (id, title, description, due_date, class_id, lesson_id, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'Cell Structure Drawing', 'Create a detailed diagram of a plant cell and an animal cell, labeling all major organelles and structures.', '2025-04-15', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'Atomic Models Comparison', 'Write a 500-word essay comparing the different atomic models and their historical significance.', '2025-04-17', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'Derivatives Problem Set', 'Complete the attached problem set applying various rules of differentiation.', '2025-04-20', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'Newton\'s Laws Lab Report', 'Write a lab report on the experiment demonstrating Newton\'s laws of motion.', '2025-04-22', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', NOW(), NOW());

-- Insert grades
INSERT INTO grades (id, score, max_score, feedback, graded_at, assignment_id, student_id) VALUES
-- Cell Structure Drawing assignment
('00000000-0000-0000-0000-000000000001', 85, 100, 'Good detail in cell structures, but some labels were incorrect.', '2025-04-17', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000002', 92, 100, 'Excellent work with accurate labels and detailed structures.', '2025-04-17', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
-- Atomic Models Comparison assignment
('00000000-0000-0000-0000-000000000003', 78, 100, 'Good historical context, but needed more detail on quantum model.', '2025-04-19', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000004', 88, 100, 'Well-researched with good comparisons between models.', '2025-04-19', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003'),
-- Derivatives Problem Set assignment
('00000000-0000-0000-0000-000000000005', 95, 100, 'Excellent work, all problems solved correctly with clear steps.', '2025-04-22', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000006', 85, 100, 'Good understanding of concepts, minor errors in chain rule applications.', '2025-04-22', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005');
