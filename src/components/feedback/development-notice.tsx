import { Alert } from "@/components/ui/alert";
import { DEVELOPMENT_STATUS } from "@/lib/constants";

export function DevelopmentNotice({
  title = "Development status",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <Alert title={title} tone="warning">
      {children ?? DEVELOPMENT_STATUS}
    </Alert>
  );
}
