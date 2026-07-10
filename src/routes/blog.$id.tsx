import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/components/compat/Link";
import { fetchBlogBySlug } from "@/lib/directory-service";

export const Route = createFileRoute("/blog/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Article | Nestoria Blog` }, { property: "og:type", content: "article" }],
    links: [{ rel: "canonical", href: `/blog/${params.id}` }],
  }),
  component: Post,
});

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "numeric" });
}

function Post() {
  const { id } = Route.useParams();
  const { data: post, isLoading } = useQuery({ queryKey: ["blog", id], queryFn: () => fetchBlogBySlug(id) });

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-slate-500">Loading…</div>;
  }
  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-950">Article not found</h1>
        <Link href="/blog" className="mt-4 inline-block font-bold text-emerald-800">Back to blog</Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{post.category}</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">{post.title}</h1>
      <p className="mt-3 text-sm text-slate-500">{formatDate(post.publishedAt)} · {post.readTime}</p>
      <img src={post.image} alt={post.title} className="mt-8 aspect-[16/9] w-full rounded-lg object-cover" />
      <div className="prose prose-slate mt-8 max-w-none text-slate-700">
        {post.excerpt && <p className="text-lg leading-8">{post.excerpt}</p>}
        {post.content && (
          <div className="mt-6 space-y-4 leading-8">
            {post.content.split(/\n\n+/).map((para, i) => <p key={i}>{para}</p>)}
          </div>
        )}
        <p className="mt-8 leading-8">
          Explore more insights on our <Link href="/blog" className="font-bold text-emerald-800">blog homepage</Link>.
        </p>
      </div>
    </article>
  );
}
