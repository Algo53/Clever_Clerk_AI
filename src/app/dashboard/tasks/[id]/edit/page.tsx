import { notFound } from "next/navigation";

import { EditTaskForm } from "@/components/dashboard/edit-task-form";

export default async function EditTaskPage({ params }: { params: { id: string } }) {
  const taskId = Number(params.id);
  if (isNaN(taskId)) notFound();

  return (
    <EditTaskForm taskId={taskId} />
  );
}
