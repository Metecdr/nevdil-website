"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteRegistration } from "@/lib/storage";

export async function deleteRegistrationAction(
  id: string
): Promise<{ success: boolean; message?: string }> {
  // Defense-in-depth: proxy korusa da action içinde tekrar doğrula
  if (!(await isAdminAuthenticated())) {
    return { success: false, message: "Yetkisiz." };
  }

  if (!id) {
    return { success: false, message: "Geçersiz kayıt." };
  }

  const ok = deleteRegistration(id);
  if (!ok) {
    return { success: false, message: "Kayıt bulunamadı veya silinemedi." };
  }

  revalidatePath("/nvd-panel");
  return { success: true };
}
