export const PLATFORMS = ["TikTok","YouTube","Instagram","X","Facebook","LinkedIn","Twitch","Threads"];

export const CATEGORIES = ["Educational","Entertainment","Promotional","Personal Brand","Storytelling","Tutorial","Review","News","Commentary","Behind the Scenes","Community","Trend","Other"];

export const CONTENT_TYPES = ["Short-form video","Long-form video","Reel","TikTok","YouTube Short","YouTube video","X post","X thread","Instagram post","Carousel","LinkedIn post","Livestream","Story","Other"];

export const CONTENT_GOALS = ["Awareness","Engagement","Growth","Conversion","Education","Community","Sales","Personal Brand"];

export const IDEA_STATUSES = ["Idea","Developing","Planned","In Progress","Scheduled","Published","Archived"];

export const CONTENT_STATUSES = ["Draft","In Progress","Review","Approved","Scheduled","Published","Archived"];

export const PRIORITIES = ["Low","Medium","High"];

export const CREATOR_TYPES = ["Content Creator","Influencer","Streamer","YouTuber","Business Owner","Entrepreneur","Agency","Brand","Social Media Manager","Other"];

export const NICHES = ["Gaming","Fitness","Business","Finance","Education","Lifestyle","Fashion","Tech","Entertainment","Sports","Beauty","Music","Other"];

export const GOAL_TYPES = ["Followers","Subscribers","Views","Engagement","Revenue","Posts","Posting consistency","Custom"];

export const REVENUE_SOURCES = ["Sponsorships","Ad revenue","Affiliates","Donations","Subscriptions","Merchandise","Other"];

export const DEAL_STATUSES = ["Prospect","Negotiating","Accepted","Creating","Submitted","Approved","Paid","Cancelled"];

export const CAMPAIGN_STATUSES = ["Planning","Active","Completed","Archived"];

export const CLIENT_STATUSES = ["Active","Onboarding","Paused","Churned"];

export const PAYMENT_STATUSES = ["Unpaid","Partial","Paid","Overdue"];

export const PLAN_LIMITS = {
  free: { ideas: 25, aiGenerations: 15, socialAccounts: 2, storage: 100, competitors: 3, clients: 1, workspaces: 1, teamMembers: 1, label: "Free" },
  pro: { ideas: Infinity, aiGenerations: 500, socialAccounts: 8, storage: 5000, competitors: 25, clients: 5, workspaces: 3, teamMembers: 5, label: "Pro" },
  business: { ideas: Infinity, aiGenerations: Infinity, socialAccounts: Infinity, storage: 50000, competitors: Infinity, clients: Infinity, workspaces: Infinity, teamMembers: Infinity, label: "Business" },
};

export const DEFAULT_TEMPLATES = [
  { name: "TikTok Hook & Payoff", description: "Three-second hook, value beat, strong payoff.", platform: "TikTok", category: "Educational", content_structure: "1. Hook (0-3s)\n2. Context (3-8s)\n3. Value/Story (8-45s)\n4. Payoff/Reveal\n5. CTA" },
  { name: "YouTube Long-form Outline", description: "Retention-optimized long-form structure.", platform: "YouTube", category: "Tutorial", content_structure: "1. Cold open\n2. Title/intro promise\n3. Chapter 1: Setup\n4. Main content (3 acts)\n5. Recap\n6. CTA + end screen" },
  { name: "Instagram Carousel", description: "Swipe-worthy educational carousel.", platform: "Instagram", category: "Educational", content_structure: "1. Cover (bold claim)\n2. Problem\n3-7. Steps/tips\n8. Summary\n9. CTA slide" },
  { name: "X Thread Starter", description: "High-signal thread that earns reposts.", platform: "X", category: "Storytelling", content_structure: "1. Hook tweet\n2. Context\n3-8. Meat (one idea per tweet)\n9. Summary\n10. CTA" },
  { name: "LinkedIn Authority Post", description: "Counterintuitive insight for professional audience.", platform: "LinkedIn", category: "Personal Brand", content_structure: "1. Counterintuitive hook\n2. Story/context\n3. The lesson\n4. Framework\n5. CTA to comment" },
  { name: "Reel Trend Remix", description: "Jump on a trend with your own spin.", platform: "Instagram", category: "Trend", content_structure: "1. Trend audio/visual\n2. Your angle\n3. Payoff\n4. CTA" },
];

export const DEMO_TRENDS = [
  { topic: "Day-in-the-life vlogs", category: "Lifestyle", platform: "TikTok", trend_strength: 88, description: "Authentic, low-edit day-in-the-life content is driving high completion rates." },
  { topic: "Carousels with frameworks", category: "Educational", platform: "Instagram", trend_strength: 76, description: "Step-by-step framework carousels are outperforming single-image posts." },
  { topic: "Long-form essays on X", category: "Business", platform: "X", trend_strength: 71, description: "Threaded essays with concrete examples are gaining saves." },
  { topic: "Faceless YouTube Shorts", category: "Tech", platform: "YouTube", trend_strength: 83, description: "Narration-led Shorts with b-roll are scaling fast in tech niches." },
  { topic: "Behind-the-scenes Reels", category: "Behind the Scenes", platform: "Instagram", trend_strength: 69, description: "Process-focused Reels build trust and watch time." },
];
