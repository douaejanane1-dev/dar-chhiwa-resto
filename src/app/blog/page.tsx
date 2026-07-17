import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { getPublishedBlogPosts } from "@/lib/db/repo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n/config";
import { postExcerpt, postTitle } from "@/lib/i18n/localize";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isValidLocale(value) ? value : defaultLocale;
  const dict = await getDictionary(locale);
  return {
    title: dict.blog.title,
    description: dict.blog.subtitle,
  };
}

export default async function BlogIndexPage() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isValidLocale(value) ? value : defaultLocale;
  const dict = await getDictionary(locale);
  const posts = await getPublishedBlogPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-sm font-bold uppercase tracking-widest text-brand">
          {dict.blog.badge}
        </span>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-extrabold text-stone-800 dark:text-stone-100">
          {dict.blog.title}
        </h1>
        <p className="mt-3 text-stone-500 dark:text-stone-400">{dict.blog.subtitle}</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-stone-400 py-20">{dict.blog.empty}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl bg-white dark:bg-surface shadow-sm ring-1 ring-stone-100 dark:ring-white/10 hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                <Image
                  src={post.coverImage}
                  alt={postTitle(post, locale)}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-stone-400 dark:text-stone-500">
                  {new Date(post.createdAt).toLocaleDateString(
                    locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-FR" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </p>
                <h2 className="mt-1 font-display text-lg font-bold text-stone-800 dark:text-stone-100">
                  {postTitle(post, locale)}
                </h2>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 line-clamp-2">
                  {postExcerpt(post, locale)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
