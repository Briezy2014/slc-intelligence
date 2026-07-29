-- Fictional development seed only. No real student information.
-- Names and organizations are synthetic.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Synthetic auth users
INSERT INTO auth.users (id, email) VALUES
  ('11111111-1111-1111-1111-111111111101', 'org.admin.north@example.test'),
  ('11111111-1111-1111-1111-111111111102', 'building.admin.north@example.test'),
  ('11111111-1111-1111-1111-111111111103', 'specialist.north@example.test'),
  ('11111111-1111-1111-1111-111111111104', 'para.north@example.test'),
  ('11111111-1111-1111-1111-111111111105', 'readonly.north@example.test'),
  ('22222222-2222-2222-2222-222222222201', 'org.admin.south@example.test'),
  ('22222222-2222-2222-2222-222222222202', 'specialist.south@example.test'),
  ('33333333-3333-3333-3333-333333333301', 'dual.membership@example.test'),
  ('44444444-4444-4444-4444-444444444401', 'inactive.user@example.test'),
  ('55555555-5555-5555-5555-555555555501', 'no.membership@example.test');

INSERT INTO public.user_profiles (id, display_name, preferred_name, status) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Avery OrgAdmin', 'Avery', 'active'),
  ('11111111-1111-1111-1111-111111111102', 'Blake BuildingAdmin', 'Blake', 'active'),
  ('11111111-1111-1111-1111-111111111103', 'Casey Specialist', 'Casey', 'active'),
  ('11111111-1111-1111-1111-111111111104', 'Drew Paraprofessional', 'Drew', 'active'),
  ('11111111-1111-1111-1111-111111111105', 'Ellis Reviewer', 'Ellis', 'active'),
  ('22222222-2222-2222-2222-222222222201', 'Finley SouthAdmin', 'Finley', 'active'),
  ('22222222-2222-2222-2222-222222222202', 'Gray SouthSpecialist', 'Gray', 'active'),
  ('33333333-3333-3333-3333-333333333301', 'Harper DualMember', 'Harper', 'active'),
  ('44444444-4444-4444-4444-444444444401', 'Indigo Inactive', 'Indigo', 'inactive'),
  ('55555555-5555-5555-5555-555555555501', 'Jordan Unassigned', 'Jordan', 'active');

INSERT INTO public.organizations (id, name, slug, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Northwind Learning Collective (FICTIONAL)', 'northwind-fictional', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Southbridge Education Cooperative (FICTIONAL)', 'southbridge-fictional', 'active');

INSERT INTO public.organization_memberships (organization_id, user_id, role_code, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111101', 'organization_admin', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111102', 'building_admin', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111103', 'intervention_specialist', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111104', 'paraprofessional', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111105', 'read_only_reviewer', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '22222222-2222-2222-2222-222222222201', 'organization_admin', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '22222222-2222-2222-2222-222222222202', 'intervention_specialist', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '33333333-3333-3333-3333-333333333301', 'intervention_specialist', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '33333333-3333-3333-3333-333333333301', 'read_only_reviewer', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '44444444-4444-4444-4444-444444444401', 'intervention_specialist', 'inactive');

INSERT INTO public.schools (id, organization_id, name, school_code, school_type) VALUES
  ('a1111111-1111-1111-1111-111111111101', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Cedar Ridge Simulated Elementary', 'CR-SIM', 'public'),
  ('a1111111-1111-1111-1111-111111111102', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Maple Grove Simulated Middle', 'MG-SIM', 'public'),
  ('b1111111-1111-1111-1111-111111111101', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Harbor Light Simulated Academy', 'HL-SIM', 'public');

INSERT INTO public.programs (id, organization_id, school_id, name, program_type) VALUES
  ('a2222222-2222-2222-2222-222222222201', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a1111111-1111-1111-1111-111111111101', 'North Specialized Learning Program', 'specialized_learning'),
  ('b2222222-2222-2222-2222-222222222201', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'b1111111-1111-1111-1111-111111111101', 'South Intervention Program', 'specialized_learning');

INSERT INTO public.classrooms (id, organization_id, school_id, program_id, name, academic_year) VALUES
  ('a3333333-3333-3333-3333-333333333301', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a1111111-1111-1111-1111-111111111101', 'a2222222-2222-2222-2222-222222222201', 'Room 12 Simulated SLC', '2025-2026'),
  ('b3333333-3333-3333-3333-333333333301', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'b1111111-1111-1111-1111-111111111101', 'b2222222-2222-2222-2222-222222222201', 'Room A Simulated SLC', '2025-2026');

INSERT INTO public.school_staff_assignments (organization_id, school_id, user_id, assignment_type) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a1111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111102', 'building_admin'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a1111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111105', 'read_only_reviewer');

INSERT INTO public.classroom_staff_assignments (organization_id, classroom_id, user_id, assignment_type) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a3333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111103', 'intervention_specialist'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a3333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111104', 'paraprofessional');

INSERT INTO public.students (id, organization_id, first_name, last_name, preferred_name, local_identifier, grade_level, enrollment_status, created_by) VALUES
  ('a4444444-4444-4444-4444-444444444401', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'River', 'Exampleton', 'River', 'N-FICT-001', '3', 'active', '11111111-1111-1111-1111-111111111101'),
  ('a4444444-4444-4444-4444-444444444402', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Sky', 'Sampleford', 'Sky', 'N-FICT-002', '4', 'active', '11111111-1111-1111-1111-111111111101'),
  ('b4444444-4444-4444-4444-444444444401', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Quinn', 'Testvale', 'Quinn', 'S-FICT-001', '5', 'active', '22222222-2222-2222-2222-222222222201');

INSERT INTO public.student_enrollments (organization_id, student_id, school_id, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444401', 'a1111111-1111-1111-1111-111111111101', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444402', 'a1111111-1111-1111-1111-111111111101', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'b4444444-4444-4444-4444-444444444401', 'b1111111-1111-1111-1111-111111111101', 'active');

INSERT INTO public.student_classroom_assignments (organization_id, student_id, classroom_id, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444401', 'a3333333-3333-3333-3333-333333333301', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444402', 'a3333333-3333-3333-3333-333333333301', 'active');

INSERT INTO public.student_staff_assignments (organization_id, student_id, user_id, assignment_role, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111103', 'intervention_specialist', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111104', 'paraprofessional', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111103', 'intervention_specialist', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'b4444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222202', 'intervention_specialist', 'active');

INSERT INTO public.iep_cycles (id, organization_id, student_id, label, start_date, end_date, review_date, status, created_by) VALUES
  ('a5555555-5555-5555-5555-555555555501', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444401', 'Simulated Annual Cycle 2025-26', '2025-09-01', '2026-08-31', '2026-05-15', 'active', '11111111-1111-1111-1111-111111111103');

INSERT INTO public.iep_goals (id, organization_id, student_id, iep_cycle_id, goal_area, goal_statement, measurement_type, unit_of_measurement, target_value, target_direction, start_date, target_date, status, responsible_user_id, created_by) VALUES
  ('a6666666-6666-6666-6666-666666666601', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444401', 'a5555555-5555-5555-5555-555555555501', 'Reading', 'When presented with grade-aligned passages, River will read with increasing accuracy.', 'reading_accuracy', 'percent', 90, 'increase', '2025-09-15', '2026-05-01', 'active', '11111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111103'),
  ('a6666666-6666-6666-6666-666666666602', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444401', 'a5555555-5555-5555-5555-555555555501', 'Behavior', 'During independent work, River will complete assigned tasks with reduced adult prompts.', 'prompt_level', 'prompt hierarchy', NULL, 'increase', '2025-09-15', '2026-05-01', 'active', '11111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111103');

INSERT INTO public.goal_baselines (organization_id, goal_id, baseline_date, measurement_type, correct_count, total_opportunities, unit, entered_by, source_description) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a6666666-6666-6666-6666-666666666601', '2025-09-10', 'reading_accuracy', 6, 10, 'percent', '11111111-1111-1111-1111-111111111103', 'Fictional baseline probe');

INSERT INTO public.intervention_phases (id, organization_id, goal_id, label, phase_type, start_date, end_date) VALUES
  ('a7777777-7777-7777-7777-777777777701', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a6666666-6666-6666-6666-666666666601', 'Baseline', 'baseline', '2025-09-01', '2025-09-14'),
  ('a7777777-7777-7777-7777-777777777702', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a6666666-6666-6666-6666-666666666601', 'Explicit instruction', 'intervention', '2025-09-15', NULL);

INSERT INTO public.progress_monitoring_sessions (id, organization_id, student_id, goal_id, session_date, collector_user_id, setting, activity, intervention_phase_id, measurement_type, status, finalized_at, finalized_by) VALUES
  ('a8888888-8888-8888-8888-888888888801', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444401', 'a6666666-6666-6666-6666-666666666601', '2025-09-20', '11111111-1111-1111-1111-111111111103', 'Classroom', 'Passage reading', 'a7777777-7777-7777-7777-777777777702', 'reading_accuracy', 'finalized', now(), '11111111-1111-1111-1111-111111111103'),
  ('a8888888-8888-8888-8888-888888888802', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444401', 'a6666666-6666-6666-6666-666666666601', '2025-09-27', '11111111-1111-1111-1111-111111111103', 'Classroom', 'Passage reading', 'a7777777-7777-7777-7777-777777777702', 'reading_accuracy', 'finalized', now(), '11111111-1111-1111-1111-111111111103'),
  ('a8888888-8888-8888-8888-888888888803', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444401', 'a6666666-6666-6666-6666-666666666601', '2025-10-04', '11111111-1111-1111-1111-111111111103', 'Classroom', 'Passage reading', 'a7777777-7777-7777-7777-777777777702', 'reading_accuracy', 'finalized', now(), '11111111-1111-1111-1111-111111111103'),
  ('a8888888-8888-8888-8888-888888888804', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a4444444-4444-4444-4444-444444444401', 'a6666666-6666-6666-6666-666666666601', '2025-10-11', '11111111-1111-1111-1111-111111111103', 'Classroom', 'Passage reading', 'a7777777-7777-7777-7777-777777777702', 'reading_accuracy', 'finalized', now(), '11111111-1111-1111-1111-111111111103');

INSERT INTO public.progress_data_points (organization_id, session_id, measurement_type, correct_count, total_opportunities, calculated_percentage, accuracy_percentage) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a8888888-8888-8888-8888-888888888801', 'reading_accuracy', 7, 10, 70, 70),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a8888888-8888-8888-8888-888888888802', 'reading_accuracy', 8, 10, 80, 80),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a8888888-8888-8888-8888-888888888803', 'reading_accuracy', 8, 10, 80, 80),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'a8888888-8888-8888-8888-888888888804', 'reading_accuracy', 9, 10, 90, 90);
