import { notFound } from "next/navigation";

import { TaskDetailClient } from "@/components/dashboard/task-detail-client";

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const taskId = Number(params.id);
  if (isNaN(taskId)) notFound();

  return (
    <div className="space-y-6">
      <TaskDetailClient taskId={taskId} />
    </div>
  );
}
