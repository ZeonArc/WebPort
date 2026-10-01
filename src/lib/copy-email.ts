import { site } from "@/content/site";
import { notify } from "@/lib/toast";

/** Copy the contact email and confirm with a toast (falls back to showing it). */
export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(site.email);
    notify("success", "Email copied", { description: site.email });
  } catch {
    notify("error", "Couldn't access the clipboard", { description: `Email me at ${site.email}` });
  }
}
