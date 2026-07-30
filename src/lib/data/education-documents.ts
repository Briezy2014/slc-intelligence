import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type {
  DistrictFormTemplate,
  EducationDocument,
  EducationDocumentType,
  EducationDocumentUpload,
  Student,
} from "@/lib/supabase/types";

export type EducationDocumentsData = {
  organizationId: string | null;
  students: Student[];
  documents: EducationDocument[];
  uploads: EducationDocumentUpload[];
  districtTemplates: DistrictFormTemplate[];
  permissions: {
    canManage: boolean;
    canRead: boolean;
  };
};

const empty: EducationDocumentsData = {
  organizationId: null,
  students: [],
  documents: [],
  uploads: [],
  districtTemplates: [],
  permissions: { canManage: false, canRead: false },
};

export async function listEducationDocuments(
  options: {
    studentId?: string;
    documentType?: EducationDocumentType;
  } = {},
): Promise<DataState<EducationDocumentsData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(empty);

  try {
    const permissions = await getPermissionFlags(context, [
      "education_document.manage",
      "education_document.read",
    ]);

    let documentsQuery = context.supabase
      .from("education_documents")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("updated_at", { ascending: false });
    let uploadsQuery = context.supabase
      .from("education_document_uploads")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("created_at", { ascending: false });

    if (options.studentId) {
      documentsQuery = documentsQuery.eq("student_id", options.studentId);
      uploadsQuery = uploadsQuery.eq("student_id", options.studentId);
    }
    if (options.documentType) {
      documentsQuery = documentsQuery.eq("document_type", options.documentType);
      uploadsQuery = uploadsQuery.eq("document_type", options.documentType);
    }

    const [studentsResult, documentsResult, uploadsResult, districtTemplatesResult] =
      await Promise.all([
        context.supabase
          .from("students")
          .select("*")
          .eq("organization_id", context.organizationId)
          .order("last_name"),
        documentsQuery,
        uploadsQuery,
        context.supabase
          .from("district_form_templates")
          .select("*")
          .eq("organization_id", context.organizationId)
          .eq("active", true)
          .order("updated_at", { ascending: false }),
      ]);

    if (studentsResult.error || documentsResult.error || uploadsResult.error) {
      return safeDataError(empty);
    }

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        students: studentsResult.data ?? [],
        documents: (documentsResult.data ?? []) as EducationDocument[],
        uploads: (uploadsResult.data ?? []) as EducationDocumentUpload[],
        // Empty until migration 202607300013 is applied.
        districtTemplates: districtTemplatesResult.error
          ? []
          : ((districtTemplatesResult.data ?? []) as DistrictFormTemplate[]),
        permissions: {
          canManage: permissions["education_document.manage"],
          canRead:
            permissions["education_document.read"] || permissions["education_document.manage"],
        },
      },
    };
  } catch {
    return safeDataError(empty);
  }
}
