import { companyOs } from "@/kernel/data/supabase";
import { publishBlogAsset } from "@/entities/campaigns/lib/blog-publish";
import { loadBlogAsset } from "./data";
import { WRITER_ACTOR, type StepRunner } from "./types";

// Step 9: publish. The same deterministic publishBlogAsset the hub button
// calls, inside the step route's request so the blog cache revalidates.
// Reached only when the brand's auto-publish switch is on; passes when the
// post is live and its URL answered 200.
//
// A post dated later than today is not published early. It is moved to
// scheduled, the same hand-off a person makes on the hub, and the daily
// publish routine puts it live on its date. That keeps a campaign written
// ahead of time from jumping the queue on the blog and in the weekly letter.
export const runPublish: StepRunner = async ({ campaign }) => {
  const loaded = await loadBlogAsset(campaign.id);
  if (!loaded.ok) return loaded;
  const blog = loaded.data;
  const today = new Date().toISOString().slice(0, 10);
  if (blog.publishDate && blog.publishDate > today && blog.status !== "published") {
    const { error } = await companyOs.from("marketing_content").update({ status: "scheduled" }).eq("id", blog.id);
    if (error) return { ok: false, error: `Publish: ${error.message}` };
    return { ok: true, summary: `Scheduled for ${blog.publishDate}; the daily publish routine puts it live that morning.` };
  }
  const r = await publishBlogAsset(blog.id, WRITER_ACTOR);
  if (!r.ok) return { ok: false, error: `Publish: ${r.errors.join(" ")}` };
  if (!r.verified) return { ok: false, error: `Publish: the post was published but ${r.liveUrl} did not answer 200. ${r.warning ?? ""}`.trim() };
  return { ok: true, summary: `Published at ${r.liveUrl}.` };
};
