import { getBlogPosts } from "@/lib/db/repo";
import { BlogAdmin } from "@/components/admin/blog-admin";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { cookies } from "next/headers";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n/config";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();
  const cookieStore = await cookies();
  const localeValue = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isValidLocale(localeValue) ? localeValue : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-stone-800 dark:text-stone-100 mb-6">
        {dict.admin.manageBlog}
      </h1>
      <BlogAdmin initialPosts={posts} />
    </div>
  );
}
