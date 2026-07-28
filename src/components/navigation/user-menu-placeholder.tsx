import { DropdownShell } from "@/components/ui/dropdown-shell";

export function UserMenuPlaceholder() {
  return (
    <DropdownShell
      label="Account placeholder"
      items={[
        { id: "profile", label: "Profile (Phase 3)", disabled: true },
        { id: "settings", label: "Settings (later)", disabled: true },
        { id: "sign-out", label: "Sign out (Phase 3)", disabled: true },
      ]}
    />
  );
}
