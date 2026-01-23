// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";


// type AnalyticsData = {
//   total_posts: number;
//   posts_by_platform: { platform: string; count: number }[];
//   recent_posts: Array<{
//     platform: string;
//     caption: string;
//     post_url: string;
//     created_at: string;
//   }>;
//   engagement_summary?: {
//     total_impressions: number;
//     total_likes: number;
//     total_comments: number;
//     total_shares: number;
//   };
// };

// function getToken() {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("token");
// }

// function getAppUser() {
//   if (typeof window === "undefined") return "";
//   return (
//     localStorage.getItem("username") ||
//     localStorage.getItem("registeredUserId") ||
//     ""
//   );
// }

// export default function AnalyticsDashboard() {
//   const router = useRouter();
//   const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       const token = getToken();
//       const appUser = getAppUser();

//       if (!token || !appUser) {
//         setError("Not authenticated. Please login.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const data = await getHubSpotAnalytics(appUser);
//         setAnalytics(data);
//       } catch (err: any) {
//         setError(err?.message || "Failed to load analytics");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalytics();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <header className="border-b border-border bg-card">
//           <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
//             <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
//             <button
//               onClick={() => router.push("/connect")}
//               className="rounded-full border border-border px-4 py-2 text-sm transition hover:bg-muted"
//             >
//               Back to Connect
//             </button>
//           </div>
//         </header>
//         <main className="mx-auto max-w-7xl px-6 py-12">
//           <div className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
//               <p className="text-sm text-muted-foreground">Loading analytics...</p>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-background">
//         <header className="border-b border-border bg-card">
//           <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
//             <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
//             <button
//               onClick={() => router.push("/connect")}
//               className="rounded-full border border-border px-4 py-2 text-sm transition hover:bg-muted"
//             >
//               Back to Connect
//             </button>
//           </div>
//         </header>
//         <main className="mx-auto max-w-7xl px-6 py-12">
//           <div className="rounded-3xl border border-border bg-card p-8 text-center">
//             <p className="text-sm text-muted-foreground">{error}</p>
//             <button
//               onClick={() => router.push("/connect")}
//               className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground"
//             >
//               Go to Connect
//             </button>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   const totalPosts = analytics?.total_posts || 0;
//   const platformData = analytics?.posts_by_platform || [];
//   const recentPosts = analytics?.recent_posts || [];
//   const engagement = analytics?.engagement_summary;

//   // Calculate platform percentages for visual representation
//   const maxCount = Math.max(...platformData.map((p) => p.count), 1);

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-card">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
//           <div>
//             <h1 className="text-xl font-semibold">Analytics Dashboard</h1>
//             <p className="mt-1 text-sm text-muted-foreground">
//               Track your social media performance across all platforms
//             </p>
//           </div>
//           <button
//             onClick={() => router.push("/connect")}
//             className="rounded-full border border-border px-4 py-2 text-sm transition hover:bg-muted"
//           >
//             Back to Connect
//           </button>
//         </div>
//       </header>

//       <main className="mx-auto max-w-7xl px-6 py-12">
//         {/* Overview Stats */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//           <StatCard
//             label="Total Posts"
//             value={totalPosts.toString()}
//             subtitle="All platforms"
//           />
//           <StatCard
//             label="LinkedIn Posts"
//             value={
//               platformData.find((p) => p.platform === "LinkedIn")?.count.toString() ||
//               "0"
//             }
//             subtitle="Professional network"
//           />
//           <StatCard
//             label="Instagram Posts"
//             value={
//               platformData.find((p) => p.platform === "Instagram")?.count.toString() ||
//               "0"
//             }
//             subtitle="Visual content"
//           />
//           <StatCard
//             label="Facebook Posts"
//             value={
//               platformData.find((p) => p.platform === "Facebook")?.count.toString() ||
//               "0"
//             }
//             subtitle="Community engagement"
//           />
//         </div>

//         {/* Engagement Metrics */}
//         {engagement && (
//           <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
//             <StatCard
//               label="Total Impressions"
//               value={engagement.total_impressions.toLocaleString()}
//               subtitle="Views across platforms"
//             />
//             <StatCard
//               label="Total Likes"
//               value={engagement.total_likes.toLocaleString()}
//               subtitle="Positive reactions"
//             />
//             <StatCard
//               label="Total Comments"
//               value={engagement.total_comments.toLocaleString()}
//               subtitle="User interactions"
//             />
//             <StatCard
//               label="Total Shares"
//               value={engagement.total_shares.toLocaleString()}
//               subtitle="Content distribution"
//             />
//           </div>
//         )}

//         {/* Platform Distribution Chart */}
//         {platformData.length > 0 && (
//           <div className="mt-8 rounded-3xl border border-border bg-card p-8">
//             <h2 className="text-lg font-semibold">Posts by Platform</h2>
//             <p className="mt-1 text-sm text-muted-foreground">
//               Distribution of your content across platforms
//             </p>

//             <div className="mt-8 space-y-4">
//               {platformData.map((platform) => (
//                 <div key={platform.platform}>
//                   <div className="mb-2 flex items-center justify-between text-sm">
//                     <span className="font-medium">{platform.platform}</span>
//                     <span className="text-muted-foreground">
//                       {platform.count} posts
//                     </span>
//                   </div>
//                   <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
//                     <div
//                       className="h-full rounded-full bg-primary transition-all duration-500"
//                       style={{
//                         width: `${(platform.count / maxCount) * 100}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Recent Posts */}
//         <div className="mt-8 rounded-3xl border border-border bg-card p-8">
//           <h2 className="text-lg font-semibold">Recent Posts</h2>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Your latest published content
//           </p>

//           {recentPosts.length === 0 ? (
//             <div className="mt-8 rounded-2xl border border-border bg-background p-12 text-center">
//               <p className="text-sm text-muted-foreground">
//                 No posts yet. Start posting to see your content here.
//               </p>
//               <button
//                 onClick={() => router.push("/connect")}
//                 className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground"
//               >
//                 Connect Platforms
//               </button>
//             </div>
//           ) : (
//             <div className="mt-6 space-y-4">
//               {recentPosts.map((post, idx) => (
//                 <div
//                   key={idx}
//                   className="rounded-2xl border border-border bg-background p-5 transition hover:bg-muted/50"
//                 >
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2">
//                         <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
//                           {post.platform}
//                         </span>
//                         <span className="text-xs text-muted-foreground">
//                           {new Date(post.created_at).toLocaleDateString("en-US", {
//                             month: "short",
//                             day: "numeric",
//                             year: "numeric",
//                           })}
//                         </span>
//                       </div>
//                       <p className="mt-2 line-clamp-2 text-sm text-foreground">
//                         {post.caption}
//                       </p>
//                     </div>
//                     {post.post_url && (
//                       <a
//                         href={post.post_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:bg-muted"
//                       >
//                         View Post
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* CTA Section */}
//         <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center">
//           <h3 className="text-lg font-semibold">Ready to create more content?</h3>
//           <p className="mt-2 text-sm text-muted-foreground">
//             Use AI Studio to generate engaging posts for all your platforms
//           </p>
//           <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
//             <button
//               onClick={() => router.push("/studio")}
//               className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
//             >
//               Open AI Studio
//             </button>
//             <button
//               onClick={() => router.push("/connect")}
//               className="rounded-full border border-border px-6 py-3 text-sm font-medium transition hover:bg-muted"
//             >
//               Manage Connections
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// function StatCard({
//   label,
//   value,
//   subtitle,
// }: {
//   label: string;
//   value: string;
//   subtitle: string;
// }) {
//   return (
//     <div className="rounded-3xl border border-border bg-card p-6">
//       <p className="text-sm text-muted-foreground">{label}</p>
//       <p className="mt-2 text-3xl font-semibold">{value}</p>
//       <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
//     </div>
//   );
// }