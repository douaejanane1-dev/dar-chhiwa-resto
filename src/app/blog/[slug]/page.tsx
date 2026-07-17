import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPostBySlug } from "@/lib/db/repo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n/config";
import { postContent, postExcerpt, postTitle } from "@/lib/i18n/localize";
import { getSiteUrl } from "@/lib/site-url";
import { StructuredData } from "@/components/structured-data";
import { ArrowLeft } from "lucide-react";

async function getLocale() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return isValidLocale(value) ? value : defaultLocale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  const locale = await getLocale();
  const base = getSiteUrl();
  const title = postTitle(post, locale);
  const description = postExcerpt(post, locale);
  const image = post.coverImage ? `${base}${post.coverImage}` : undefined;

  return {
    title,
    description,
    alternates: { canonical: `${base}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.published) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const base = getSiteUrl();
  const title = postTitle(post, locale);
  const content = postContent(post, locale);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    image: post.coverImage ? [`${base}${post.coverImage}`] : undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <StructuredData data={articleSchema} />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline mb-6"
      >
        <ArrowLeft size={15} aria-hidden="true" className="rtl:rotate-180" /> {dict.blog.backToBlog}
      </Link>

      <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-800">
        <Image src={post.coverImage} alt={title} fill unoptimized className="object-cover" priority />
      </div>

      <p className="mt-6 text-xs text-stone-400 dark:text-stone-500">
        {post.author} &middot;{" "}
        {new Date(post.createdAt).toLocaleDateString(
          locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-FR" : "en-US",
          { year: "numeric", month: "long", day: "numeric" }
        )}
      </p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl font-extrabold text-stone-800 dark:text-stone-100">
        {title}
      </h1>

      <div className="max-w-none mt-6 whitespace-pre-line leading-relaxed text-stone-700 dark:text-stone-300">
        {content}
      </div>
    </article>
  );
}
