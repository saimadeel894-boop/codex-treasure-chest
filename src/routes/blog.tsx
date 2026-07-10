import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/components/compat/Link";
import { fetchBlogs } from "@/lib/directory-service";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog | Nestoria Australia" },
      { name: "description", content: "Property market insights, buyer guides, and seller tips." },
    ],
  }),
  component: Blog,
});

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "numeric" });
}

function Blog() {
  const { data: posts = [], isLoading } = useQuery({ queryKey: ["blogs"], queryFn: fetchBlogs });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-950">Insights & guides</h1>
      <p className="mt-2 text-slate-600">The latest from the Nestoria editorial team.</p>
      {isLoading ? (
        <p className="mt-10 text-slate-500">Loading articles…</p>
      ) : posts.length === 0 ? (
        <p className="mt-10 text-slate-500">No articles published yet.</p>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{post.category}</p>
                <h2 className="mt-2 text-lg font-bold text-slate-950">
                  <Link href={`/blog/${post.slug}`} className="hover:text-emerald-800">{post.title}</Link>
                </h2>
                <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
                <p className="mt-4 text-xs text-slate-500">{formatDate(post.publishedAt)} · {post.readTime}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
