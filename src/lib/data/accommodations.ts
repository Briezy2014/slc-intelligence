import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type {
  AccommodationImplementationLog,
  AccommodationLibraryItem,
  AccommodationReviewRecord,
  IepCycle,
  Student,
  StudentAccommodation,
} from "@/lib/supabase/types";

export type AccommodationsData = {
  organizationId: string | null;
  organizationName: string | null;
  students: Student[];
  cycles: IepCycle[];
  libraryItems: AccommodationLibraryItem[];
  accommodations: StudentAccommodation[];
  implementationLogs: AccommodationImplementationLog[];
  reviews: AccommodationReviewRecord[];
  permissions: {
    canManageLibrary: boolean;
    canManageAccommodations: boolean;
    canImplement: boolean;
    canRead: boolean;
  };
};

const emptyAccommodationsData: AccommodationsData = {
  organizationId: null,
  organizationName: null,
  students: [],
  cycles: [],
  libraryItems: [],
  accommodations: [],
  implementationLogs: [],
  reviews: [],
  permissions: {
    canManageLibrary: false,
    canManageAccommodations: false,
    canImplement: false,
    canRead: false,
  },
};

export async function listAccommodations(
  options: {
    studentId?: string;
    accommodationId?: string;
    libraryItemId?: string;
  } = {},
): Promise<DataState<AccommodationsData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyAccommodationsData);

  try {
    const permissions = await getPermissionFlags(context, [
      "accommodation.library.manage",
      "accommodation.manage",
      "accommodation.implement",
      "accommodation.read",
    ]);

    let accommodationsQuery = context.supabase
      .from("student_accommodations")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("updated_at", { ascending: false });
    let libraryQuery = context.supabase
      .from("accommodation_library_items")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("name");

    if (options.studentId)
      accommodationsQuery = accommodationsQuery.eq("student_id", options.studentId);
    if (options.accommodationId)
      accommodationsQuery = accommodationsQuery.eq("id", options.accommodationId);
    if (options.libraryItemId) libraryQuery = libraryQuery.eq("id", options.libraryItemId);

    const [studentsResult, cyclesResult, libraryResult, accommodationsResult] = await Promise.all([
      context.supabase
        .from("students")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("last_name"),
      context.supabase
        .from("iep_cycles")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("start_date", { ascending: false }),
      libraryQuery,
      accommodationsQuery,
    ]);

    if (
      studentsResult.error ||
      cyclesResult.error ||
      libraryResult.error ||
      accommodationsResult.error
    ) {
      return safeDataError(emptyAccommodationsData);
    }

    const accommodationIds = (accommodationsResult.data ?? []).map(
      (accommodation) => accommodation.id,
    );
    const [logsResult, reviewsResult] = accommodationIds.length
      ? await Promise.all([
          context.supabase
            .from("accommodation_implementation_logs")
            .select("*")
            .in("student_accommodation_id", accommodationIds)
            .order("log_date", { ascending: false }),
          context.supabase
            .from("accommodation_review_records")
            .select("*")
            .in("student_accommodation_id", accommodationIds)
            .order("review_date", { ascending: false }),
        ])
      : [
          { data: [] as AccommodationImplementationLog[], error: null },
          { data: [] as AccommodationReviewRecord[], error: null },
        ];

    if (logsResult.error || reviewsResult.error) return safeDataError(emptyAccommodationsData);

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        students: studentsResult.data ?? [],
        cycles: cyclesResult.data ?? [],
        libraryItems: libraryResult.data ?? [],
        accommodations: accommodationsResult.data ?? [],
        implementationLogs: logsResult.data ?? [],
        reviews: reviewsResult.data ?? [],
        permissions: {
          canManageLibrary: permissions["accommodation.library.manage"],
          canManageAccommodations: permissions["accommodation.manage"],
          canImplement: permissions["accommodation.implement"],
          canRead: permissions["accommodation.read"],
        },
      },
    };
  } catch {
    return safeDataError(emptyAccommodationsData);
  }
}
