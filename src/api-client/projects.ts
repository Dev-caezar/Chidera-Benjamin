import { request } from "./http";
import type { Project, ProjectInput } from "@/types/project";

export const projectsApi = {
  listAll: () => request<Project[]>("/api/projects?all=true"),

  create: (body: ProjectInput) =>
    request<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: Partial<ProjectInput>) =>
    request<Project>(`/api/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  remove: (id: string) =>
    request<{ ok: true }>(`/api/projects/${id}`, { method: "DELETE" }),
};
