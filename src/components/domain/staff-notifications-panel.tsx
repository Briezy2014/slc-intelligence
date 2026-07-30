"use client";

import { useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { markStaffNotificationReadAction } from "@/lib/actions/communications";
import type { StaffNotification } from "@/lib/supabase/types";

export function StaffNotificationsPanel({
  organizationId,
  notifications,
}: {
  organizationId: string | null;
  notifications: StaffNotification[];
}) {
  const [pending, startTransition] = useTransition();
  const unread = notifications.filter((notification) => !notification.read_at);
  const recent = notifications.slice(0, 12);

  if (!organizationId) return null;

  return (
    <Card>
      <CardTitle>Parent read / signature notifications</CardTitle>
      <CardDescription>
        When a parent checks “I have read this” and sends their name, staff see it here. Email push
        is not required for this in-app queue.
      </CardDescription>
      <div className="mt-4 space-y-3">
        {unread.length === 0 ? (
          <Alert title="No unread parent acknowledgments" tone="info">
            New parent read/sign events will appear here automatically.
          </Alert>
        ) : (
          <Alert
            title={`${unread.length} unread parent acknowledgment${unread.length === 1 ? "" : "s"}`}
            tone="info"
          >
            Open Family Communication regularly to clear these after review.
          </Alert>
        )}
        {recent.map((notification) => (
          <div
            key={notification.id}
            className="border-border rounded-[var(--radius-md)] border p-3 text-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">
                  {!notification.read_at ? "● " : ""}
                  {notification.title}
                </p>
                <p className="text-muted mt-1">{notification.body}</p>
                <p className="text-muted mt-1 text-xs">
                  {new Date(notification.created_at).toLocaleString()}
                  {notification.read_at ? " · marked read" : ""}
                </p>
              </div>
              {!notification.read_at ? (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={pending}
                  onClick={() => {
                    startTransition(async () => {
                      const formData = new FormData();
                      formData.set("organizationId", organizationId);
                      formData.set("notificationId", notification.id);
                      await markStaffNotificationReadAction(formData);
                    });
                  }}
                >
                  Mark read
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
