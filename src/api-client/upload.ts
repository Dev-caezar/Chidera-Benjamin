import { request } from "./http";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const data = await request<{ url: string }>("/api/upload", {
    method: "POST",
    body: formData,
  });

  return data.url;
}
