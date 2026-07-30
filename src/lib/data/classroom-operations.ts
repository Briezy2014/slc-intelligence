import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type {
  Classroom,
  ClassroomAnnouncement,
  ClassroomRoutine,
  ClassroomSchedule,
  ClassroomScheduleBlock,
  DailyStudentNote,
  ReinforcementSystem,
  Student,
} from "@/lib/supabase/types";

export type ClassroomOperationsData = {
  organizationId: string | null;
  organizationName: string | null;
  classrooms: Classroom[];
  students: Student[];
  schedules: ClassroomSchedule[];
  scheduleBlocks: ClassroomScheduleBlock[];
  routines: ClassroomRoutine[];
  dailyNotes: DailyStudentNote[];
  announcements: ClassroomAnnouncement[];
  reinforcementSystems: ReinforcementSystem[];
  permissions: {
    canManageSchedules: boolean;
    canReadOperations: boolean;
    canManageRoutines: boolean;
    canAssignDuties: boolean;
    canEnterDailyNotes: boolean;
    canFinalizeDailyNotes: boolean;
    canReadDailyNotes: boolean;
    canManageReinforcement: boolean;
    canManageAnnouncements: boolean;
  };
};

const emptyClassroomOperationsData: ClassroomOperationsData = {
  organizationId: null,
  organizationName: null,
  classrooms: [],
  students: [],
  schedules: [],
  scheduleBlocks: [],
  routines: [],
  dailyNotes: [],
  announcements: [],
  reinforcementSystems: [],
  permissions: {
    canManageSchedules: false,
    canReadOperations: false,
    canManageRoutines: false,
    canAssignDuties: false,
    canEnterDailyNotes: false,
    canFinalizeDailyNotes: false,
    canReadDailyNotes: false,
    canManageReinforcement: false,
    canManageAnnouncements: false,
  },
};

export async function listClassroomOperations(
  options: { classroomId?: string; studentId?: string } = {},
): Promise<DataState<ClassroomOperationsData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyClassroomOperationsData);

  try {
    const permissions = await getPermissionFlags(context, [
      "classroom.schedule.manage",
      "classroom.operations.read",
      "routine.manage",
      "staff.duty.assign",
      "daily_note.enter",
      "daily_note.finalize",
      "daily_note.read",
      "reinforcement.manage",
      "announcement.manage",
    ]);

    let schedulesQuery = context.supabase
      .from("classroom_schedules")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("updated_at", { ascending: false });
    let routinesQuery = context.supabase
      .from("classroom_routines")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("name");
    let announcementsQuery = context.supabase
      .from("classroom_announcements")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("publish_at", { ascending: false });
    if (options.classroomId) {
      schedulesQuery = schedulesQuery.eq("classroom_id", options.classroomId);
      routinesQuery = routinesQuery.eq("classroom_id", options.classroomId);
      announcementsQuery = announcementsQuery.eq("classroom_id", options.classroomId);
    }

    let dailyNotesQuery = context.supabase
      .from("daily_student_notes")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("note_date", { ascending: false });
    if (options.studentId) dailyNotesQuery = dailyNotesQuery.eq("student_id", options.studentId);

    const [
      classroomsResult,
      studentsResult,
      schedulesResult,
      routinesResult,
      notesResult,
      announcementsResult,
      reinforcementResult,
    ] = await Promise.all([
      context.supabase
        .from("classrooms")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("name"),
      context.supabase
        .from("students")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("last_name"),
      schedulesQuery,
      routinesQuery,
      dailyNotesQuery,
      announcementsQuery,
      context.supabase
        .from("reinforcement_systems")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("name"),
    ]);

    if (
      classroomsResult.error ||
      studentsResult.error ||
      schedulesResult.error ||
      routinesResult.error ||
      notesResult.error ||
      announcementsResult.error ||
      reinforcementResult.error
    ) {
      return safeDataError(emptyClassroomOperationsData);
    }

    const scheduleIds = (schedulesResult.data ?? []).map((schedule) => schedule.id);
    const blocksResult = scheduleIds.length
      ? await context.supabase
          .from("classroom_schedule_blocks")
          .select("*")
          .in("schedule_id", scheduleIds)
          .order("day_of_week")
          .order("start_time")
      : { data: [] as ClassroomScheduleBlock[], error: null };

    if (blocksResult.error) return safeDataError(emptyClassroomOperationsData);

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        classrooms: classroomsResult.data ?? [],
        students: studentsResult.data ?? [],
        schedules: schedulesResult.data ?? [],
        scheduleBlocks: blocksResult.data ?? [],
        routines: routinesResult.data ?? [],
        dailyNotes: notesResult.data ?? [],
        announcements: announcementsResult.data ?? [],
        reinforcementSystems: reinforcementResult.data ?? [],
        permissions: {
          canManageSchedules: permissions["classroom.schedule.manage"],
          canReadOperations: permissions["classroom.operations.read"],
          canManageRoutines: permissions["routine.manage"],
          canAssignDuties: permissions["staff.duty.assign"],
          canEnterDailyNotes: permissions["daily_note.enter"],
          canFinalizeDailyNotes: permissions["daily_note.finalize"],
          canReadDailyNotes: permissions["daily_note.read"],
          canManageReinforcement: permissions["reinforcement.manage"],
          canManageAnnouncements: permissions["announcement.manage"],
        },
      },
    };
  } catch {
    return safeDataError(emptyClassroomOperationsData);
  }
}
