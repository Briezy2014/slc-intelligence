-- FICTIONAL ONLY: Phase 13-15 development seed data.
-- All organizations, students, staff, contacts, meetings, services, and notes in this file are synthetic.

INSERT INTO public.accommodation_library_items (
  id, organization_id, name, accommodation_area, description, default_implementation_notes, created_by
) VALUES
  (
    'd1300000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'FICTIONAL visual direction card',
    'Executive function',
    'Provide a brief visual card with the first two steps of independent work.',
    'Offer the card before independent work begins; fade prompts when the student starts without reminders.',
    '11111111-1111-1111-1111-111111111103'
  ),
  (
    'd1300000-0000-0000-0000-000000000002',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'FICTIONAL reduced-distraction workspace',
    'Environment',
    'Offer access to a quieter work location during fictional writing tasks.',
    'Use only when requested by the student or when agreed in the support plan.',
    '22222222-2222-2222-2222-222222222202'
  );

INSERT INTO public.student_accommodations (
  id, organization_id, student_id, iep_cycle_id, library_item_id, title, accommodation_area,
  description, implementation_notes, accommodation_snapshot, status, start_date, created_by
) VALUES
  (
    'd1310000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    'a5555555-5555-5555-5555-555555555501',
    'd1300000-0000-0000-0000-000000000001',
    'FICTIONAL visual direction card for River',
    'Executive function',
    'River may use a visual direction card for multi-step independent work.',
    'Place the FICTIONAL card on the desk before reading and writing centers.',
    '{"source":"FICTIONAL seed","area":"executive_function"}',
    'active',
    '2025-09-15',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.student_accommodation_versions (
  id, organization_id, student_accommodation_id, student_id, version_number, snapshot, reason, created_by
) VALUES
  (
    'd1320000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1310000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    1,
    '{"title":"FICTIONAL visual direction card for River","status":"active"}',
    'FICTIONAL initial accommodation snapshot.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.accommodation_implementation_logs (
  id, organization_id, student_accommodation_id, student_id, log_date, implemented_by,
  setting, implementation_status, status, notes, finalized_at, finalized_by, created_by
) VALUES
  (
    'd1330000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1310000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    '2025-10-14',
    '11111111-1111-1111-1111-111111111104',
    'FICTIONAL reading center',
    'implemented',
    'finalized',
    'FICTIONAL visual card was available before independent reading.',
    '2025-10-14 18:00:00+00',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111104'
  );

INSERT INTO public.accommodation_review_records (
  id, organization_id, student_accommodation_id, student_id, review_date, reviewed_by, review_summary, recommendation, next_review_date
) VALUES
  (
    'd1340000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1310000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    '2025-10-20',
    '11111111-1111-1111-1111-111111111103',
    'FICTIONAL review found the support was consistently available.',
    'Continue and review prompt fading in the next team check-in.',
    '2025-11-20'
  );

INSERT INTO public.service_definitions (
  id, organization_id, name, service_area, description, default_delivery_type, created_by
) VALUES
  (
    'd1350000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'FICTIONAL occupational therapy consultation',
    'Occupational therapy',
    'Synthetic related-service consultation for classroom access supports.',
    'group',
    '11111111-1111-1111-1111-111111111101'
  ),
  (
    'd1350000-0000-0000-0000-000000000002',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'FICTIONAL speech-language small group',
    'Speech-language',
    'Synthetic small-group service definition for Southbridge.',
    'group',
    '22222222-2222-2222-2222-222222222201'
  );

INSERT INTO public.student_service_plans (
  id, organization_id, student_id, iep_cycle_id, service_definition_id, title, description,
  service_snapshot, status, start_date, created_by, activated_at, activated_by
) VALUES
  (
    'd1360000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    'a5555555-5555-5555-5555-555555555501',
    'd1350000-0000-0000-0000-000000000001',
    'FICTIONAL OT classroom consultation',
    'Consultation and group support for fictional classroom routines.',
    '{"minutes_per_week":30,"source":"FICTIONAL seed"}',
    'active',
    '2025-09-15',
    '11111111-1111-1111-1111-111111111103',
    '2025-09-15 12:00:00+00',
    '11111111-1111-1111-1111-111111111101'
  );

INSERT INTO public.student_service_plan_versions (
  id, organization_id, service_plan_id, student_id, version_number, snapshot, reason, created_by
) VALUES
  (
    'd1370000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1360000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    1,
    '{"title":"FICTIONAL OT classroom consultation","status":"active","minutes_per_week":30}',
    'FICTIONAL initial service plan snapshot.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.service_plan_components (
  id, organization_id, service_plan_id, component_name, service_minutes, frequency, setting, delivery_type, notes, sort_order
) VALUES
  (
    'd1380000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1360000-0000-0000-0000-000000000001',
    'FICTIONAL classroom routine group',
    30,
    'Weekly',
    'North Room 12',
    'group',
    'Group delivery may include River and Sky in the synthetic classroom.',
    1
  );

INSERT INTO public.service_provider_assignments (
  id, organization_id, service_plan_id, provider_user_id, assignment_role, status, start_date
) VALUES
  (
    'd1390000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1360000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111103',
    'FICTIONAL service coordinator',
    'active',
    '2025-09-15'
  );

INSERT INTO public.service_schedules (
  id, organization_id, service_plan_id, service_component_id, day_of_week, start_time,
  planned_duration_minutes, recurrence_note, location
) VALUES
  (
    'd13a0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1360000-0000-0000-0000-000000000001',
    'd1380000-0000-0000-0000-000000000001',
    2,
    '10:30',
    30,
    'FICTIONAL weekly Tuesday consultation during centers; no exploded planned rows.',
    'North Room 12'
  );

INSERT INTO public.service_cancellation_reasons (
  id, organization_id, code, label, description, created_by
) VALUES
  (
    'd13b0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'FICTIONAL_ASSEMBLY',
    'FICTIONAL school assembly',
    'Synthetic cancellation reason for development seed data.',
    '11111111-1111-1111-1111-111111111101'
  );

INSERT INTO public.service_delivery_logs (
  id, organization_id, service_plan_id, service_component_id, primary_student_id, provider_user_id,
  service_date, start_time, end_time, delivery_type, service_status, record_status,
  cancellation_reason_id, notes, finalized_at, finalized_by, created_by
) VALUES
  (
    'd13c0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1360000-0000-0000-0000-000000000001',
    'd1380000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    '11111111-1111-1111-1111-111111111103',
    '2025-10-21',
    '10:30',
    '11:00',
    'group',
    'delivered',
    'finalized',
    NULL,
    'FICTIONAL group service delivery with River and Sky.',
    '2025-10-21 18:00:00+00',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111103'
  ),
  (
    'd13c0000-0000-0000-0000-000000000002',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1360000-0000-0000-0000-000000000001',
    'd1380000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    '11111111-1111-1111-1111-111111111103',
    '2025-10-28',
    NULL,
    NULL,
    'group',
    'school_closed',
    'finalized',
    'd13b0000-0000-0000-0000-000000000001',
    'FICTIONAL planned service was not delivered due to a simulated schedule change.',
    '2025-10-28 18:00:00+00',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111103'
  ),
  (
    'd13c0000-0000-0000-0000-000000000003',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1360000-0000-0000-0000-000000000001',
    'd1380000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    '11111111-1111-1111-1111-111111111103',
    '2025-10-30',
    '13:00',
    '13:30',
    'group',
    'delivered',
    'finalized',
    NULL,
    'FICTIONAL makeup service for the simulated missed group session.',
    '2025-10-30 18:00:00+00',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.service_delivery_participants (
  organization_id, delivery_log_id, student_id, participation_note
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd13c0000-0000-0000-0000-000000000001', 'a4444444-4444-4444-4444-444444444401', 'FICTIONAL primary participant.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd13c0000-0000-0000-0000-000000000001', 'a4444444-4444-4444-4444-444444444402', 'FICTIONAL peer group participant.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd13c0000-0000-0000-0000-000000000003', 'a4444444-4444-4444-4444-444444444401', 'FICTIONAL makeup participant.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd13c0000-0000-0000-0000-000000000003', 'a4444444-4444-4444-4444-444444444402', 'FICTIONAL makeup peer participant.');

INSERT INTO public.service_delivery_status_history (
  organization_id, delivery_log_id, from_status, to_status, changed_by, note
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd13c0000-0000-0000-0000-000000000001', 'draft', 'finalized', '11111111-1111-1111-1111-111111111103', 'FICTIONAL finalized group delivery.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd13c0000-0000-0000-0000-000000000002', 'draft', 'finalized', '11111111-1111-1111-1111-111111111103', 'FICTIONAL finalized missed service record.');

INSERT INTO public.makeup_service_links (
  id, organization_id, original_log_id, makeup_log_id, status, note, created_by
) VALUES
  (
    'd13d0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd13c0000-0000-0000-0000-000000000002',
    'd13c0000-0000-0000-0000-000000000003',
    'completed',
    'FICTIONAL makeup linked to the simulated missed group delivery.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.service_note_templates (
  id, organization_id, name, template_body, service_area, created_by
) VALUES
  (
    'd13e0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'FICTIONAL group service note',
    'FICTIONAL participants practiced the scheduled support routine; record only descriptive participation.',
    'Occupational therapy',
    '11111111-1111-1111-1111-111111111101'
  );

INSERT INTO public.service_review_records (
  id, organization_id, service_plan_id, student_id, review_date, reviewed_by, review_summary, recommendation, next_review_date
) VALUES
  (
    'd13f0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1360000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    '2025-11-03',
    '11111111-1111-1111-1111-111111111103',
    'FICTIONAL service review noted one delivered group session and one linked makeup.',
    'Continue weekly service schedule.',
    '2025-12-03'
  );

INSERT INTO public.service_exports (
  id, organization_id, service_plan_id, student_id, exported_by, export_format, date_range_start, date_range_end, metadata
) VALUES
  (
    'd1400000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1360000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    '11111111-1111-1111-1111-111111111101',
    'csv',
    '2025-10-01',
    '2025-10-31',
    '{"label":"FICTIONAL October service export"}'
  );

INSERT INTO public.student_contacts (
  id, organization_id, student_id, first_name, last_name, relationship, contact_type,
  email, phone_primary, is_primary, status, created_by
) VALUES
  (
    'd1410000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    'Morgan',
    'Exampleton',
    'FICTIONAL caregiver',
    'guardian',
    'morgan.exampleton@example.test',
    '555-0101',
    true,
    'active',
    '11111111-1111-1111-1111-111111111103'
  ),
  (
    'd1410000-0000-0000-0000-000000000002',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'b4444444-4444-4444-4444-444444444401',
    'Rowan',
    'Testvale',
    'FICTIONAL caregiver',
    'guardian',
    'rowan.testvale@example.test',
    '555-0201',
    true,
    'active',
    '22222222-2222-2222-2222-222222222202'
  );

INSERT INTO public.contact_preferences (
  id, organization_id, contact_id, student_id, preferred_method, preferred_language, interpreter_needed, best_times, notes
) VALUES
  (
    'd1420000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1410000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    'email',
    'English',
    false,
    'FICTIONAL weekday afternoons',
    'Synthetic preference for development only.'
  );

INSERT INTO public.communication_categories (
  id, organization_id, name, description, created_by
) VALUES
  (
    'd1430000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'FICTIONAL weekly update',
    'Synthetic family communication category.',
    '11111111-1111-1111-1111-111111111101'
  );

INSERT INTO public.communication_logs (
  id, organization_id, student_id, contact_id, category_id, occurred_at, method, direction,
  visibility, subject, summary, followup_needed, status, finalized_at, finalized_by, created_by
) VALUES
  (
    'd1440000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    'd1410000-0000-0000-0000-000000000001',
    'd1430000-0000-0000-0000-000000000001',
    '2025-10-24 20:00:00+00',
    'email',
    'outbound',
    'family_visible',
    'FICTIONAL weekly classroom update',
    'Shared a synthetic update about routines, service participation, and upcoming review dates.',
    false,
    'finalized',
    '2025-10-24 20:10:00+00',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111103'
  ),
  (
    'd1440000-0000-0000-0000-000000000002',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    NULL,
    'd1430000-0000-0000-0000-000000000001',
    '2025-10-24 20:20:00+00',
    'in_person',
    'internal',
    'internal',
    'FICTIONAL internal prep note',
    'Synthetic staff-only communication note for planning the next classroom support review.',
    true,
    'draft',
    NULL,
    NULL,
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.communication_participants (
  organization_id, communication_log_id, participant_kind, user_id, contact_id, external_name, external_role
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1440000-0000-0000-0000-000000000001', 'staff', '11111111-1111-1111-1111-111111111103', NULL, NULL, NULL),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1440000-0000-0000-0000-000000000001', 'contact', NULL, 'd1410000-0000-0000-0000-000000000001', NULL, NULL),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1440000-0000-0000-0000-000000000002', 'staff', '11111111-1111-1111-1111-111111111102', NULL, NULL, NULL);

INSERT INTO public.communication_followups (
  id, organization_id, communication_log_id, student_id, assigned_to, due_date, status, description
) VALUES
  (
    'd1450000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1440000-0000-0000-0000-000000000002',
    'a4444444-4444-4444-4444-444444444401',
    '11111111-1111-1111-1111-111111111103',
    '2025-10-31',
    'open',
    'FICTIONAL follow-up to prepare classroom support review notes.'
  );

INSERT INTO public.communication_templates (
  id, organization_id, name, default_visibility, method, subject_template, body_template, created_by
) VALUES
  (
    'd1460000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'FICTIONAL weekly update template',
    'family_visible',
    'email',
    'FICTIONAL weekly update',
    'This synthetic template summarizes descriptive supports and next steps.',
    '11111111-1111-1111-1111-111111111101'
  );

INSERT INTO public.communication_attachments (
  id, organization_id, communication_log_id, student_id, storage_path, file_name, content_type, metadata, uploaded_by
) VALUES
  (
    'd1470000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1440000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    'fictional/communications/river-weekly-update.pdf',
    'FICTIONAL weekly update.pdf',
    'application/pdf',
    '{"fictional":true,"credentials":false}',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.communication_status_history (
  organization_id, communication_log_id, from_status, to_status, changed_by, note
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1440000-0000-0000-0000-000000000001', 'draft', 'finalized', '11111111-1111-1111-1111-111111111103', 'FICTIONAL family-visible communication finalized.');

INSERT INTO public.meeting_types (
  id, organization_id, name, description, created_by
) VALUES
  (
    'd1480000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'FICTIONAL support review',
    'Synthetic meeting type for development support reviews.',
    '11111111-1111-1111-1111-111111111101'
  );

INSERT INTO public.meetings (
  id, organization_id, student_id, meeting_type_id, title, scheduled_start, scheduled_end,
  location, status, created_by, finalized_at, finalized_by
) VALUES
  (
    'd1490000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    'd1480000-0000-0000-0000-000000000001',
    'FICTIONAL River support review',
    '2025-11-06 15:00:00+00',
    '2025-11-06 15:45:00+00',
    'North Room 12',
    'finalized',
    '11111111-1111-1111-1111-111111111103',
    '2025-11-06 18:00:00+00',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.meeting_participants (
  organization_id, meeting_id, participant_kind, user_id, contact_id, external_name, external_role,
  invitation_status, attendance_status
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', 'staff', '11111111-1111-1111-1111-111111111103', NULL, NULL, NULL, 'accepted', 'present'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', 'staff', '11111111-1111-1111-1111-111111111102', NULL, NULL, NULL, 'accepted', 'present'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', 'contact', NULL, 'd1410000-0000-0000-0000-000000000001', NULL, NULL, 'accepted', 'present'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', 'external', NULL, NULL, 'FICTIONAL agency consultant', 'Synthetic external participant', 'sent', 'present');

INSERT INTO public.meeting_agenda_items (
  organization_id, meeting_id, title, description, sort_order
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', 'FICTIONAL accommodation implementation', 'Review descriptive implementation logs.', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', 'FICTIONAL service schedule', 'Review planned vs recorded service notes.', 2);

INSERT INTO public.meeting_notes (
  organization_id, meeting_id, note_kind, note_text, created_by
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', 'discussion', 'FICTIONAL team reviewed descriptive support records and classroom routines.', '11111111-1111-1111-1111-111111111103'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', 'family_input', 'FICTIONAL caregiver reported the visual routine is helpful at home.', '11111111-1111-1111-1111-111111111103'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', 'internal_prep', 'FICTIONAL internal prep note for staff-only review context.', '11111111-1111-1111-1111-111111111102');

INSERT INTO public.meeting_decisions (
  organization_id, meeting_id, decision_text, rationale, created_by
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', 'FICTIONAL continue visual direction card.', 'Synthetic logs showed consistent availability.', '11111111-1111-1111-1111-111111111103');

INSERT INTO public.meeting_action_items (
  organization_id, meeting_id, assigned_to, description, due_date, status
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111103', 'FICTIONAL update classroom visual card examples.', '2025-11-13', 'open');

INSERT INTO public.meeting_acknowledgements (
  id, organization_id, meeting_id, contact_id, acknowledged_by_name, status, note, recorded_by
) VALUES
  (
    'd14a0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1490000-0000-0000-0000-000000000001',
    'd1410000-0000-0000-0000-000000000001',
    'Morgan Exampleton',
    'acknowledged',
    'FICTIONAL acknowledgement only; not legal consent.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.meeting_documents (
  organization_id, meeting_id, document_type, title, storage_path, metadata, uploaded_by
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', 'summary', 'FICTIONAL support review summary', 'fictional/meetings/river-support-review.pdf', '{"fictional":true}', '11111111-1111-1111-1111-111111111103');

INSERT INTO public.meeting_status_history (
  organization_id, meeting_id, from_status, to_status, changed_by, note
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1490000-0000-0000-0000-000000000001', 'held', 'finalized', '11111111-1111-1111-1111-111111111103', 'FICTIONAL meeting finalized.');

INSERT INTO public.meeting_versions (
  id, organization_id, meeting_id, version_number, snapshot, reason, created_by
) VALUES
  (
    'd14b0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1490000-0000-0000-0000-000000000001',
    1,
    '{"title":"FICTIONAL River support review","status":"finalized"}',
    'FICTIONAL finalized meeting snapshot.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.calendar_event_links (
  id, organization_id, meeting_id, external_provider, external_event_id, sync_status, metadata, created_by
) VALUES
  (
    'd14c0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1490000-0000-0000-0000-000000000001',
    'FICTIONAL_CALENDAR',
    'fictional-event-river-support-review',
    'linked',
    '{"readiness_only":true}',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.classroom_schedules (
  id, organization_id, classroom_id, name, academic_year, status, created_by
) VALUES
  (
    'd1500000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a3333333-3333-3333-3333-333333333301',
    'FICTIONAL North Room 12 daily schedule',
    '2025-2026',
    'active',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.classroom_schedule_blocks (
  organization_id, schedule_id, classroom_id, day_of_week, start_time, end_time, label, block_type, location, sort_order
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1500000-0000-0000-0000-000000000001', 'a3333333-3333-3333-3333-333333333301', 1, '08:30', '09:00', 'FICTIONAL arrival routine', 'routine', 'North Room 12', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1500000-0000-0000-0000-000000000001', 'a3333333-3333-3333-3333-333333333301', 1, '10:30', '11:00', 'FICTIONAL service group', 'service', 'North Room 12', 2);

INSERT INTO public.classroom_schedule_exceptions (
  organization_id, schedule_id, classroom_id, exception_date, reason, replacement_note, created_by
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1500000-0000-0000-0000-000000000001', 'a3333333-3333-3333-3333-333333333301', '2025-10-28', 'FICTIONAL assembly schedule', 'Service group moved to makeup date.', '11111111-1111-1111-1111-111111111103');

INSERT INTO public.student_schedules (
  id, organization_id, student_id, classroom_id, name, status, created_by
) VALUES
  (
    'd1510000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    'a3333333-3333-3333-3333-333333333301',
    'FICTIONAL River visual schedule',
    'active',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.student_schedule_blocks (
  organization_id, student_schedule_id, student_id, day_of_week, start_time, end_time, label, support_note
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1510000-0000-0000-0000-000000000001', 'a4444444-4444-4444-4444-444444444401', 1, '08:30', '09:00', 'FICTIONAL arrival checklist', 'Use visual direction card.');

INSERT INTO public.classroom_routines (
  id, organization_id, classroom_id, name, description, created_by
) VALUES
  (
    'd1520000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a3333333-3333-3333-3333-333333333301',
    'FICTIONAL arrival routine',
    'Synthetic classroom arrival routine for North Room 12.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.routine_steps (
  organization_id, routine_id, step_text, prompt_note, sort_order
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1520000-0000-0000-0000-000000000001', 'FICTIONAL put backpack in cubby.', 'Visual cue if needed.', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1520000-0000-0000-0000-000000000001', 'FICTIONAL check visual schedule.', 'Point to first activity.', 2);

INSERT INTO public.routine_assignments (
  organization_id, routine_id, classroom_id, student_id, status
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1520000-0000-0000-0000-000000000001', 'a3333333-3333-3333-3333-333333333301', NULL, 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1520000-0000-0000-0000-000000000001', NULL, 'a4444444-4444-4444-4444-444444444401', 'active');

INSERT INTO public.routine_implementation_logs (
  organization_id, routine_id, classroom_id, student_id, log_date, implementation_status, note, recorded_by
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1520000-0000-0000-0000-000000000001', 'a3333333-3333-3333-3333-333333333301', 'a4444444-4444-4444-4444-444444444401', '2025-10-22', 'observed', 'FICTIONAL routine completed with visual cue.', '11111111-1111-1111-1111-111111111104');

INSERT INTO public.task_analyses (
  id, organization_id, classroom_id, name, description, created_by
) VALUES
  (
    'd1530000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a3333333-3333-3333-3333-333333333301',
    'FICTIONAL pack-up task analysis',
    'Synthetic steps for end-of-day pack-up.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.task_analysis_steps (
  organization_id, task_analysis_id, step_text, prompt_note, sort_order
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1530000-0000-0000-0000-000000000001', 'FICTIONAL gather folder.', 'Visual prompt.', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1530000-0000-0000-0000-000000000001', 'FICTIONAL place folder in backpack.', 'Gestural prompt if needed.', 2);

INSERT INTO public.student_task_assignments (
  id, organization_id, task_analysis_id, student_id, status, start_date
) VALUES
  (
    'd1540000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1530000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    'active',
    '2025-10-01'
  );

INSERT INTO public.task_completion_logs (
  organization_id, task_assignment_id, student_id, log_date, completion_status, prompt_level, note, recorded_by
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1540000-0000-0000-0000-000000000001', 'a4444444-4444-4444-4444-444444444401', '2025-10-22', 'prompted', 'visual', 'FICTIONAL pack-up completed with visual prompt.', '11111111-1111-1111-1111-111111111104');

INSERT INTO public.executive_function_skill_areas (
  id, organization_id, name, description, created_by
) VALUES
  (
    'd1550000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'FICTIONAL task initiation',
    'Synthetic executive-function skill area.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.student_executive_function_plans (
  id, organization_id, student_id, skill_area_id, title, description, status, start_date, created_by
) VALUES
  (
    'd1560000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    'd1550000-0000-0000-0000-000000000001',
    'FICTIONAL River task initiation plan',
    'Descriptive support plan for synthetic task initiation routines.',
    'active',
    '2025-10-01',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.executive_function_supports (
  id, organization_id, ef_plan_id, support_name, support_description, prompt_hierarchy
) VALUES
  (
    'd1570000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1560000-0000-0000-0000-000000000001',
    'FICTIONAL first-then visual',
    'Show the first task and next preferred activity before independent work.',
    'visual to gestural to verbal'
  );

INSERT INTO public.executive_function_observations (
  id, organization_id, ef_plan_id, support_id, student_id, observation_date, observer_user_id,
  prompt_level, observation_note, status, finalized_at, finalized_by
) VALUES
  (
    'd1580000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'd1560000-0000-0000-0000-000000000001',
    'd1570000-0000-0000-0000-000000000001',
    'a4444444-4444-4444-4444-444444444401',
    '2025-10-22',
    '11111111-1111-1111-1111-111111111104',
    'visual',
    'FICTIONAL observation: River started after reviewing visual support.',
    'finalized',
    '2025-10-22 18:00:00+00',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.ef_observation_status_history (
  organization_id, observation_id, from_status, to_status, changed_by, note
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1580000-0000-0000-0000-000000000001', 'draft', 'finalized', '11111111-1111-1111-1111-111111111103', 'FICTIONAL EF observation finalized.');

INSERT INTO public.student_checklists (
  id, organization_id, student_id, title, description, created_by
) VALUES
  (
    'd1590000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    'FICTIONAL morning checklist',
    'Synthetic daily checklist for task initiation.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.student_checklist_items (
  id, organization_id, checklist_id, student_id, item_text, sort_order
) VALUES
  ('d15a0000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1590000-0000-0000-0000-000000000001', 'a4444444-4444-4444-4444-444444444401', 'FICTIONAL check schedule.', 1),
  ('d15a0000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1590000-0000-0000-0000-000000000001', 'a4444444-4444-4444-4444-444444444401', 'FICTIONAL start first task.', 2);

INSERT INTO public.student_checklist_responses (
  organization_id, checklist_id, checklist_item_id, student_id, response_date, response, note, responded_by
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1590000-0000-0000-0000-000000000001', 'd15a0000-0000-0000-0000-000000000001', 'a4444444-4444-4444-4444-444444444401', '2025-10-22', 'yes', 'FICTIONAL completed with visual cue.', '11111111-1111-1111-1111-111111111104'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1590000-0000-0000-0000-000000000001', 'd15a0000-0000-0000-0000-000000000002', 'a4444444-4444-4444-4444-444444444401', '2025-10-22', 'partial', 'FICTIONAL needed one prompt.', '11111111-1111-1111-1111-111111111104');

INSERT INTO public.transition_supports (
  id, organization_id, student_id, from_activity, to_activity, support_description, created_by
) VALUES
  (
    'd15b0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    'FICTIONAL reading center',
    'FICTIONAL service group',
    'Use a two-minute transition warning and first-then visual.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.classroom_duty_assignments (
  id, organization_id, classroom_id, user_id, duty_name, duty_date, start_time, end_time, created_by
) VALUES
  (
    'd15c0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a3333333-3333-3333-3333-333333333301',
    '11111111-1111-1111-1111-111111111104',
    'FICTIONAL arrival visual support',
    '2025-10-22',
    '08:25',
    '09:00',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.student_support_assignments (
  id, organization_id, student_id, user_id, support_role, start_date, created_by
) VALUES
  (
    'd15d0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    '11111111-1111-1111-1111-111111111104',
    'FICTIONAL checklist response support',
    '2025-10-01',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.staff_duty_assignments (
  id, organization_id, user_id, school_id, classroom_id, duty_name, duty_date, start_time, end_time, created_by
) VALUES
  (
    'd15e0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '11111111-1111-1111-1111-111111111103',
    'a1111111-1111-1111-1111-111111111101',
    'a3333333-3333-3333-3333-333333333301',
    'FICTIONAL weekly materials check',
    '2025-10-24',
    '14:30',
    '15:00',
    '11111111-1111-1111-1111-111111111101'
  );

INSERT INTO public.daily_student_notes (
  id, organization_id, student_id, note_date, note_text, status, entered_by, finalized_at, finalized_by
) VALUES
  (
    'd15f0000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    '2025-10-22',
    'FICTIONAL daily note: visual supports were available during arrival and reading center.',
    'finalized',
    '11111111-1111-1111-1111-111111111104',
    '2025-10-22 20:00:00+00',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.classroom_announcements (
  id, organization_id, classroom_id, title, body, contains_student_pii, audience, publish_at, status, created_by
) VALUES
  (
    'd1600000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a3333333-3333-3333-3333-333333333301',
    'FICTIONAL North Room 12 materials reminder',
    'FICTIONAL staff reminder: refresh generic visual cards before morning centers. Do not include student-specific details here.',
    false,
    'staff',
    '2025-10-20 12:00:00+00',
    'published',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.reinforcement_systems (
  id, organization_id, student_id, classroom_id, name, description, created_by
) VALUES
  (
    'd1610000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    NULL,
    'FICTIONAL choice-based reinforcement',
    'Synthetic reinforcement menu; not punitive and not tied to basic needs.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.reinforcement_options (
  id, organization_id, reinforcement_system_id, option_label, description, sort_order
) VALUES
  ('d1620000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1610000-0000-0000-0000-000000000001', 'FICTIONAL drawing choice', 'Synthetic choice from a preferred activity menu.', 1),
  ('d1620000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1610000-0000-0000-0000-000000000001', 'FICTIONAL helper job', 'Synthetic classroom helper choice.', 2);

INSERT INTO public.reinforcement_records (
  organization_id, reinforcement_system_id, reinforcement_option_id, student_id, record_date, count, note, recorded_by
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1610000-0000-0000-0000-000000000001', 'd1620000-0000-0000-0000-000000000001', 'a4444444-4444-4444-4444-444444444401', '2025-10-22', 1, 'FICTIONAL student selected drawing after checklist completion.', '11111111-1111-1111-1111-111111111103');

INSERT INTO public.choice_boards (
  id, organization_id, student_id, classroom_id, title, description, created_by
) VALUES
  (
    'd1630000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'a4444444-4444-4444-4444-444444444401',
    NULL,
    'FICTIONAL break choice board',
    'Synthetic choice board for regulation breaks.',
    '11111111-1111-1111-1111-111111111103'
  );

INSERT INTO public.choice_board_items (
  organization_id, choice_board_id, label, description, sort_order
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1630000-0000-0000-0000-000000000001', 'FICTIONAL quiet reading', 'Synthetic choice board item.', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'd1630000-0000-0000-0000-000000000001', 'FICTIONAL drawing page', 'Synthetic choice board item.', 2);
