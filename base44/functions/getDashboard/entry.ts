import { createClientFromRequest } from "npm:@base44/sdk@0.8.40";

// Reusable API service: aggregates everything a Command Center / home screen
// needs in a single authenticated call. Designed so any client (web, iOS,
// Android, Windows, macOS) can render the dashboard without N round trips
// or duplicating business logic. Data is user-scoped via the app-user token.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const [ideas, content, events, goals] = await Promise.all([
      base44.entities.Idea.list("-created_date", 50),
      base44.entities.Content.list("-updated_date", 50),
      base44.entities.CalendarEvent.list("scheduled_date", 100),
      base44.entities.Goal.list("-updated_date", 20),
    ]);

    const published = content.filter((c) => c.status === "Published");
    const totalViews = published.reduce((s, c) => s + (c.views || 0), 0);
    const totalEngagement = published.reduce(
      (s, c) => s + (c.likes || 0) + (c.comments || 0) + (c.shares || 0),
      0
    );
    const upcoming = events
      .filter((e) => new Date(e.scheduled_date) >= new Date())
      .slice(0, 6);

    const draftCount = content.filter((c) => c.status === "Draft").length;
    const ideaCount = ideas.filter((i) => i.status === "Idea").length;

    const insights = [
      published.length > 0 && `Your published content has generated ${totalViews.toLocaleString()} total views.`,
      draftCount > 0 && `You have ${draftCount} drafts waiting to be finished.`,
      ideaCount > 0 && `${ideaCount} ideas are ready to develop into content.`,
      `${upcoming.length} posts scheduled upcoming.`,
    ].filter(Boolean);

    return Response.json({
      user,
      stats: {
        totalViews,
        totalEngagement,
        publishedCount: published.length,
        upcomingCount: upcoming.length,
      },
      recentIdeas: ideas.slice(0, 6),
      upcoming,
      goals,
      insights,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
