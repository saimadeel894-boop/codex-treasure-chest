import { createFileRoute, notFound } from "@tanstack/react-router";
import { Link } from "@/components/compat/Link";
import { blogPosts } from "@/data/marketplace";

export const Route = createFileRoute("/blog/$id")({
  head: ({ params }) => {
    const post = blogPosts.find((p) => p.id === params.id);
    return { meta: [{ title: post ? `${post.title} | Nestoria Blog` : "Article" }] };
  },
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.id === params.id);
    if (!post) throw notFound();
    return { post };
  },
  component: Post,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-950">Article not found</h1>
      <Link href="/blog" className="mt-4 inline-block font-bold text-emerald-800">Back to blog</Link>
    </div>
  ),
});

function Post() {
  const { post } = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{post.category}</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-950">{post.title}</h1>
      <p className="mt-3 text-sm text-slate-500">{post.date} · {post.readTime}</p>
      <img src={post.image} alt={post.title} className="mt-8 aspect-[16/9] w-full rounded-lg object-cover" />
      <div className="prose prose-slate mt-8 max-w-none text-slate-700">
        <p className="text-lg leading-8">{post.excerpt}</p>
        <p className="mt-6 leading-8">
          This is a sample article body. The Nestoria editorial team publishes weekly guides,
          market updates, and property-buying tips for Australians. Backend connectivity is not
          yet wired up, so this content is illustrative only.
        </p>
        <p className="mt-4 leading-8">
          Explore more insights on our <Link href="/blog" className="font-bold text-emerald-800">blog homepage</Link>.
        </p>
      </div>
    </article>
  );
}
