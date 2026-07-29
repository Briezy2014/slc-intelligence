-- FICTIONAL ONLY: Phase 9-12 development seed data.
-- All organizations, students, staff, behaviors, and notes in this file are synthetic.

INSERT INTO public.reporting_periods (
  id, organization_id, name, academic_year, start_date, end_date, due_date, school_id, program_id, status, created_by
) VALUES
  (
    '90000000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'FICTIONAL Quarter 1',
    '2025-2026',
    '2025-09-01',
    '2025-10-31',
    '2025-11-07',
    'a1111111-1111-1111-1111-111111111101',
    'a2222222-2222-2222-2222-222222222201',
    'active',
    '11111111-1111-1111-1111-111111111101'
  ),
  (
    '90000000-0000-0000-0000-000000000002',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'FICTIONAL Quarter 1',
    '2025-2026',
    '2025-09-01',
    '2025-10-31',
    '2025-11-07',
    'b1111111-1111-1111-1111-111111111101',
    'b2222222-2222-2222-2222-222222222201',
    'active',
    '22222222-2222-2222-2222-222222222201'
  );

INSERT INTO public.progress_reports (
  id, organization_id, student_id, iep_cycle_id, reporting_period_id, status, prepared_by, assigned_reviewer_id,
  submitted_at, finalized_at, finalized_by, version_number
) VALUES
  (
    '91000000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    'a5555555-5555-5555-5555-555555555501',
    '90000000-0000-0000-0000-000000000001',
    'finalized',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111102',
    '2025-11-03 14:30:00+00',
    '2025-11-05 16:00:00+00',
    '11111111-1111-1111-1111-111111111103',
    1
  ),
  (
    '91000000-0000-0000-0000-000000000002',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    'a5555555-5555-5555-5555-555555555501',
    '90000000-0000-0000-0000-000000000001',
    'draft',
    '11111111-1111-1111-1111-111111111103',
    NULL,
    NULL,
    NULL,
    NULL,
    1
  );

INSERT INTO public.progress_report_goal_sections (
  id, report_id, goal_id, goal_statement_snapshot, baseline_snapshot, target_snapshot, period_start, period_end,
  observation_count, current_performance_summary, trend_summary, prompt_summary, generalization_summary,
  maintenance_summary, intervention_phase_summary, data_sufficiency_status, data_sufficiency_notes,
  educator_narrative, progress_descriptor, descriptor_source, system_summary_draft
) VALUES
  (
    '92000000-0000-0000-0000-000000000001',
    '91000000-0000-0000-0000-000000000001',
    'a6666666-6666-6666-6666-666666666601',
    'When presented with grade-aligned passages, River will read with increasing accuracy.',
    '{"baseline_date":"2025-09-10","correct_count":6,"total_opportunities":10,"unit":"percent"}',
    '{"target_value":90,"unit":"percent","target_direction":"increase"}',
    '2025-09-01',
    '2025-10-31',
    4,
    'River read fictional probe passages at 70%, 80%, 80%, and 90% accuracy during the period.',
    'Accuracy increased across the fictional data series.',
    NULL,
    'River generalized the strategy to two simulated classroom reading activities.',
    'Maintenance has not yet been evaluated in this fictional period.',
    'Explicit instruction phase was active for all reported observations.',
    'sufficient',
    'Four finalized fictional probes were available for review.',
    'River is making steady progress toward the annual reading accuracy goal.',
    'progressing',
    'finalized',
    'River showed a positive fictional trend in reading accuracy and should continue the current intervention plan.'
  );

INSERT INTO public.progress_report_evidence_links (
  id, section_id, evidence_type, evidence_id, label, date_range_start, date_range_end, metadata
) VALUES
  (
    '93000000-0000-0000-0000-000000000001',
    '92000000-0000-0000-0000-000000000001',
    'session',
    'a8888888-8888-8888-8888-888888888801',
    'FICTIONAL passage reading probe 2025-09-20',
    '2025-09-20',
    '2025-09-20',
    '{"accuracy_percentage":70}'
  ),
  (
    '93000000-0000-0000-0000-000000000002',
    '92000000-0000-0000-0000-000000000001',
    'analytics_range',
    NULL,
    'FICTIONAL Q1 reading accuracy trend',
    '2025-09-20',
    '2025-10-11',
    '{"sessions":4,"trend":"increasing"}'
  );

INSERT INTO public.progress_report_status_history (
  report_id, from_status, to_status, changed_by, note
) VALUES
  (
    '91000000-0000-0000-0000-000000000001',
    'approved',
    'finalized',
    '11111111-1111-1111-1111-111111111103',
    'FICTIONAL finalized report for development data.'
  );

INSERT INTO public.progress_report_versions (
  id, report_id, version_number, snapshot, created_by, reason
) VALUES
  (
    '94000000-0000-0000-0000-000000000001',
    '91000000-0000-0000-0000-000000000001',
    1,
    '{"status":"finalized","student":"River Exampleton","period":"FICTIONAL Quarter 1","sections":[{"goal_area":"Reading","descriptor":"progressing"}]}',
    '11111111-1111-1111-1111-111111111103',
    'FICTIONAL finalized reporting snapshot.'
  );

INSERT INTO public.report_exports (
  id, report_id, organization_id, exported_by, export_format, version_number
) VALUES
  (
    '94000000-0000-0000-0000-000000000002',
    '91000000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '11111111-1111-1111-1111-111111111103',
    'print',
    1
  );

INSERT INTO public.behavior_definitions (
  id, organization_id, student_id, name, operational_definition, measurement_notes, status, created_by
) VALUES
  (
    '95000000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    'FICTIONAL work refusal',
    'River puts materials aside, says "no work", or leaves the assigned seat for more than ten seconds after a task direction.',
    'Use ABC, frequency, and duration methods for fictional analysis.',
    'active',
    '11111111-1111-1111-1111-111111111103'
  ),
  (
    '95000000-0000-0000-0000-000000000002',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'b4444444-4444-4444-4444-444444444401',
    'FICTIONAL calling out',
    'Quinn speaks above conversational volume without being called on during group instruction.',
    'Frequency count during simulated instruction blocks.',
    'active',
    '22222222-2222-2222-2222-222222222202'
  );

INSERT INTO public.behavior_definition_examples (
  behavior_definition_id, example_text, sort_order
) VALUES
  ('95000000-0000-0000-0000-000000000001', 'River says "no work" and pushes a fictional worksheet away.', 1),
  ('95000000-0000-0000-0000-000000000002', 'Quinn answers aloud before a fictional teacher prompt is complete.', 1);

INSERT INTO public.behavior_definition_nonexamples (
  behavior_definition_id, nonexample_text, sort_order
) VALUES
  ('95000000-0000-0000-0000-000000000001', 'River asks for help while keeping materials on the desk.', 1),
  ('95000000-0000-0000-0000-000000000002', 'Quinn whispers to a partner during assigned collaboration time.', 1);

INSERT INTO public.replacement_behavior_definitions (
  id, organization_id, student_id, behavior_definition_id, name, replacement_statement, teaching_notes, status, created_by
) VALUES
  (
    '96000000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    '95000000-0000-0000-0000-000000000001',
    'FICTIONAL break request',
    'River uses a break card or verbal request to ask for a two-minute break before leaving the task.',
    'Practice with fictional task cards before independent work.',
    'active',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.intensity_scale_definitions (
  id, organization_id, behavior_id, name, created_by
) VALUES
  (
    '97000000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '95000000-0000-0000-0000-000000000001',
    'FICTIONAL work refusal intensity',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.intensity_scale_levels (
  id, scale_id, level_number, label, observable_anchor
) VALUES
  ('97000000-0000-0000-0000-000000000101', '97000000-0000-0000-0000-000000000001', 1, 'Low', 'Brief verbal protest while remaining with materials.'),
  ('97000000-0000-0000-0000-000000000102', '97000000-0000-0000-0000-000000000001', 2, 'Moderate', 'Materials pushed away or head down for more than ten seconds.'),
  ('97000000-0000-0000-0000-000000000103', '97000000-0000-0000-0000-000000000001', 3, 'High', 'Leaves assigned area or refuses for more than two minutes.');

INSERT INTO public.behavior_observation_sessions (
  id, organization_id, student_id, behavior_definition_id, measurement_method, session_date, session_time,
  observer_user_id, setting, activity, people_present, status, notes, finalized_at, finalized_by, created_by
) VALUES
  (
    '98000000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    '95000000-0000-0000-0000-000000000001',
    'abc',
    '2025-10-06',
    '09:15',
    '11111111-1111-1111-1111-111111111103',
    'FICTIONAL classroom',
    'Independent reading task',
    'Teacher and paraprofessional',
    'finalized',
    'FICTIONAL ABC observation.',
    '2025-10-06 15:00:00+00',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111103'
  ),
  (
    '98000000-0000-0000-0000-000000000002',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    '95000000-0000-0000-0000-000000000001',
    'frequency',
    '2025-10-07',
    '10:00',
    '11111111-1111-1111-1111-111111111104',
    'FICTIONAL classroom',
    'Writing center',
    'Paraprofessional',
    'finalized',
    'FICTIONAL frequency count.',
    '2025-10-07 16:00:00+00',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111104'
  ),
  (
    '98000000-0000-0000-0000-000000000003',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    '95000000-0000-0000-0000-000000000001',
    'duration',
    '2025-10-08',
    '13:30',
    '11111111-1111-1111-1111-111111111103',
    'FICTIONAL resource room',
    'Math practice',
    'Specialist',
    'finalized',
    'FICTIONAL duration observation.',
    '2025-10-08 19:00:00+00',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111103'
  ),
  (
    '98000000-0000-0000-0000-000000000004',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'b4444444-4444-4444-4444-444444444401',
    '95000000-0000-0000-0000-000000000002',
    'frequency',
    '2025-10-09',
    '11:00',
    '22222222-2222-2222-2222-222222222202',
    'FICTIONAL group room',
    'Group instruction',
    'Specialist and peers',
    'finalized',
    'FICTIONAL Quinn frequency observation.',
    '2025-10-09 17:00:00+00',
    '22222222-2222-2222-2222-222222222202',
    '22222222-2222-2222-2222-222222222202'
  );

INSERT INTO public.abc_observations (
  id, session_id, recorded_antecedent, observable_behavior, recorded_consequence,
  duration_seconds, intensity_level_id, replacement_observed, notes
) VALUES
  (
    '98100000-0000-0000-0000-000000000001',
    '98000000-0000-0000-0000-000000000001',
    'A fictional independent passage was placed on the desk.',
    'River pushed the passage away and said "no work".',
    'The adult offered a modeled first sentence and a brief choice.',
    95,
    '97000000-0000-0000-0000-000000000102',
    true,
    'River used the fictional break card after one prompt.'
  );

INSERT INTO public.frequency_observations (
  id, session_id, count, observation_duration_seconds, calculated_rate_per_minute
) VALUES
  (
    '98200000-0000-0000-0000-000000000001',
    '98000000-0000-0000-0000-000000000002',
    3,
    1800,
    0.10
  ),
  (
    '98200000-0000-0000-0000-000000000002',
    '98000000-0000-0000-0000-000000000004',
    6,
    1200,
    0.30
  );

INSERT INTO public.duration_observations (
  id, session_id, total_duration_seconds, episode_count, average_episode_seconds
) VALUES
  (
    '98300000-0000-0000-0000-000000000001',
    '98000000-0000-0000-0000-000000000003',
    210,
    2,
    105
  );

INSERT INTO public.abc_category_options (
  id, organization_id, category_type, code, label, active
) VALUES
  ('98400000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'antecedent', 'task_demand', 'Task demand', true),
  ('98400000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'antecedent', 'transition', 'Transition', true),
  ('98400000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'consequence', 'adult_attention', 'Adult attention', true),
  ('98400000-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'consequence', 'task_modified', 'Task modified', true),
  ('98400000-0000-0000-0000-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'antecedent', 'group_instruction', 'Group instruction', true),
  ('98400000-0000-0000-0000-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'antecedent', 'peer_comment', 'Peer comment', true),
  ('98400000-0000-0000-0000-000000000007', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'consequence', 'teacher_prompt', 'Teacher prompt', true),
  ('98400000-0000-0000-0000-000000000008', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'consequence', 'peer_attention', 'Peer attention', true);

INSERT INTO public.abc_observation_category_assignments (
  id, abc_observation_id, session_id, category_type, category_code, source, confirmed_by
) VALUES
  (
    '98410000-0000-0000-0000-000000000001',
    '98100000-0000-0000-0000-000000000001',
    '98000000-0000-0000-0000-000000000001',
    'antecedent',
    'task_demand',
    'confirmed',
    '11111111-1111-1111-1111-111111111103'
  ),
  (
    '98410000-0000-0000-0000-000000000002',
    '98100000-0000-0000-0000-000000000001',
    '98000000-0000-0000-0000-000000000001',
    'consequence',
    'task_modified',
    'confirmed',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.organization_time_blocks (
  id, organization_id, code, label, start_time, end_time, sort_order
) VALUES
  ('98500000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'morning_instruction', 'FICTIONAL morning instruction', '08:30', '10:30', 1),
  ('98500000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'afternoon_practice', 'FICTIONAL afternoon practice', '12:30', '14:30', 2),
  ('98500000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'group_instruction', 'FICTIONAL group instruction', '10:30', '12:00', 1);

INSERT INTO public.fba_evidence_workspaces (
  id, organization_id, student_id, behavior_definition_id, date_range_start, date_range_end, status,
  educator_hypothesis, hypothesis_confirmed, team_notes, created_by
) VALUES
  (
    '98600000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    '95000000-0000-0000-0000-000000000001',
    '2025-10-01',
    '2025-10-15',
    'draft',
    'FICTIONAL hypothesis: work refusal is more likely during independent tasks with high reading demand.',
    false,
    'FICTIONAL team will review additional morning instruction observations.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.fba_evidence_links (
  id, workspace_id, evidence_type, evidence_id, label
) VALUES
  ('98700000-0000-0000-0000-000000000001', '98600000-0000-0000-0000-000000000001', 'behavior_session', '98000000-0000-0000-0000-000000000001', 'FICTIONAL ABC work refusal session'),
  ('98700000-0000-0000-0000-000000000002', '98600000-0000-0000-0000-000000000001', 'frequency_observation', '98200000-0000-0000-0000-000000000001', 'FICTIONAL frequency work refusal observation');

INSERT INTO public.intervention_library_items (
  id, organization_id, name, category, description, evidence_level, status, created_by
) VALUES
  (
    '99000000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'FICTIONAL structured break card routine',
    'Behavior support',
    'Teach a student to request a short structured break before leaving a difficult task.',
    'promising',
    'active',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.intervention_plans (
  id, organization_id, student_id, library_item_id, title, description, status, start_date,
  created_by, owner_user_id, activated_at, activated_by
) VALUES
  (
    '99100000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    '99000000-0000-0000-0000-000000000001',
    'FICTIONAL River break card plan',
    'A fictional plan to teach River to request a break during challenging independent work.',
    'active',
    '2025-10-01',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111103',
    '2025-10-01 14:00:00+00',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.intervention_plan_versions (
  id, plan_id, version_number, snapshot, created_by, reason
) VALUES
  (
    '99200000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    1,
    '{"title":"FICTIONAL River break card plan","status":"active","components":["Teach break request","Honor brief break","Return to task"]}',
    '11111111-1111-1111-1111-111111111103',
    'FICTIONAL initial active plan snapshot.'
  );

INSERT INTO public.intervention_components (
  id, plan_id, label, description, implementation_notes, sort_order, active
) VALUES
  (
    '99300000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    'Teach break request',
    'Model and rehearse handing the fictional break card to an adult.',
    'Practice before independent reading tasks.',
    1,
    true
  ),
  (
    '99300000-0000-0000-0000-000000000002',
    '99100000-0000-0000-0000-000000000001',
    'Return to task',
    'Use a visual timer and a first-then reminder to return after the break.',
    'Adult prompts fade from verbal to gesture.',
    2,
    true
  );

INSERT INTO public.intervention_target_behaviors (
  id, plan_id, behavior_definition_id, target_description
) VALUES
  (
    '99400000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    '95000000-0000-0000-0000-000000000001',
    'Reduce FICTIONAL work refusal during independent academic tasks.'
  );

INSERT INTO public.intervention_replacement_behaviors (
  id, plan_id, replacement_behavior_definition_id, replacement_description
) VALUES
  (
    '99500000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    '96000000-0000-0000-0000-000000000001',
    'Increase independent use of the FICTIONAL break request routine.'
  );

INSERT INTO public.intervention_staff_assignments (
  id, plan_id, user_id, responsibility_type, role_description, status, start_date
) VALUES
  (
    '99600000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111103',
    'lead',
    'FICTIONAL plan lead and review coordinator.',
    'active',
    '2025-10-01'
  ),
  (
    '99600000-0000-0000-0000-000000000002',
    '99100000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111104',
    'implementer',
    'FICTIONAL classroom implementation support.',
    'active',
    '2025-10-01'
  );

INSERT INTO public.intervention_schedules (
  id, plan_id, schedule_label, frequency, days_of_week, start_time, end_time, setting
) VALUES
  (
    '99700000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    'FICTIONAL independent work block',
    'Daily on instructional days',
    '["monday","tuesday","wednesday","thursday"]',
    '09:00',
    '09:30',
    'FICTIONAL classroom'
  );

INSERT INTO public.fidelity_checklists (
  id, plan_id, title, description, status, created_by
) VALUES
  (
    '99800000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    'FICTIONAL break card fidelity checklist',
    'Checklist for simulated implementation fidelity.',
    'active',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.fidelity_checklist_items (
  id, checklist_id, item_text, sort_order, required
) VALUES
  ('99810000-0000-0000-0000-000000000001', '99800000-0000-0000-0000-000000000001', 'Break card is visible before the task begins.', 1, true),
  ('99810000-0000-0000-0000-000000000002', '99800000-0000-0000-0000-000000000001', 'Adult honors a break request within ten seconds.', 2, true),
  ('99810000-0000-0000-0000-000000000003', '99800000-0000-0000-0000-000000000001', 'Adult prompts return to task after the timer.', 3, true);

INSERT INTO public.fidelity_observations (
  id, plan_id, checklist_id, observation_date, observer_user_id, status, notes, finalized_at, finalized_by, created_by
) VALUES
  (
    '99820000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    '99800000-0000-0000-0000-000000000001',
    '2025-10-10',
    '11111111-1111-1111-1111-111111111103',
    'finalized',
    'FICTIONAL fidelity observation showed most steps implemented.',
    '2025-10-10 18:00:00+00',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.fidelity_item_responses (
  id, observation_id, checklist_item_id, response, notes
) VALUES
  ('99830000-0000-0000-0000-000000000001', '99820000-0000-0000-0000-000000000001', '99810000-0000-0000-0000-000000000001', 'yes', 'FICTIONAL card was on desk.'),
  ('99830000-0000-0000-0000-000000000002', '99820000-0000-0000-0000-000000000001', '99810000-0000-0000-0000-000000000002', 'yes', 'FICTIONAL request was honored quickly.'),
  ('99830000-0000-0000-0000-000000000003', '99820000-0000-0000-0000-000000000001', '99810000-0000-0000-0000-000000000003', 'partial', 'FICTIONAL return prompt required a verbal reminder.');

INSERT INTO public.intervention_dosage_logs (
  id, plan_id, log_date, delivered_by, duration_minutes, sessions_delivered, setting, notes, created_by
) VALUES
  (
    '99840000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    '2025-10-10',
    '11111111-1111-1111-1111-111111111104',
    20,
    1,
    'FICTIONAL classroom',
    'FICTIONAL break card routine delivered during reading work.',
    '11111111-1111-1111-1111-111111111104'
  );

INSERT INTO public.intervention_review_records (
  id, plan_id, review_date, reviewer_user_id, summary, outcome, next_review_date
) VALUES
  (
    '99850000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    '2025-10-15',
    '11111111-1111-1111-1111-111111111103',
    'FICTIONAL review found improved replacement behavior use and recommends continued implementation.',
    'continue',
    '2025-10-29'
  );

INSERT INTO public.intervention_outcome_links (
  id, plan_id, evidence_type, evidence_id, label
) VALUES
  (
    '99860000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    'behavior_session',
    '98000000-0000-0000-0000-000000000001',
    'FICTIONAL ABC session linked to intervention review.'
  ),
  (
    '99860000-0000-0000-0000-000000000002',
    '99100000-0000-0000-0000-000000000001',
    'fba_workspace',
    '98600000-0000-0000-0000-000000000001',
    'FICTIONAL FBA workspace linked to plan design.'
  );

INSERT INTO public.intervention_status_history (
  id, plan_id, from_status, to_status, changed_by, note
) VALUES
  (
    '99870000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    'ready_for_review',
    'active',
    '11111111-1111-1111-1111-111111111103',
    'FICTIONAL plan activated for development seed data.'
  );

INSERT INTO public.intervention_plan_phases (
  id, plan_id, label, start_date, end_date, phase_type, notes
) VALUES
  (
    '99880000-0000-0000-0000-000000000001',
    '99100000-0000-0000-0000-000000000001',
    'FICTIONAL initial implementation',
    '2025-10-01',
    '2025-10-31',
    'implementation',
    'Use daily break-card practice during fictional independent work.'
  );
