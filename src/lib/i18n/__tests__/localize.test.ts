import { describe, expect, it } from "vitest";
import {
  categoryName,
  itemDescription,
  itemName,
  localizedField,
  postExcerpt,
  postTitle,
} from "@/lib/i18n/localize";
import type { Category, MenuItem, BlogPost } from "@/lib/db/types";

describe("localizedField", () => {
  it("returns the base string for fr locale", () => {
    expect(localizedField("Tagine", "طاجين", "Tagine", "fr")).toBe("Tagine");
  });

  it("returns the arabic string for ar locale", () => {
    expect(localizedField("Tagine", "طاجين", "Tagine", "ar")).toBe("طاجين");
  });

  it("returns the english string for en locale", () => {
    expect(localizedField("Tagine", "طاجين", "Chicken Tagine", "en")).toBe("Chicken Tagine");
  });

  it("falls back to the base string when the translation is empty", () => {
    expect(localizedField("Tagine", "", "", "en")).toBe("Tagine");
  });
});

const category: Category = {
  id: "cat-1",
  name: "Tagines",
  nameAr: "طواجن",
  nameEn: "Tagines",
  icon: "🍲",
  order: 0,
};

const item: MenuItem = {
  id: "item-1",
  categoryId: "cat-1",
  name: "Tagine Poulet",
  nameAr: "طاجين دجاج",
  nameEn: "Chicken Tagine",
  description: "Tagine mijote avec olives et citron confit",
  descriptionAr: "طاجين مطبوخ بالزيتون والليمون المخلل",
  descriptionEn: "Slow-cooked tagine with olives and preserved lemon",
  price: 65,
  image: "/img.jpg",
  isAvailable: true,
  isFeatured: false,
  spicyLevel: 1,
  tags: [],
};

const post: BlogPost = {
  id: "post-1",
  slug: "test-post",
  title: "Titre",
  titleAr: "عنوان",
  titleEn: "Title",
  excerpt: "Extrait",
  excerptAr: "ملخص",
  excerptEn: "Excerpt",
  content: "Contenu",
  contentAr: "محتوى",
  contentEn: "Content",
  coverImage: "/cover.jpg",
  author: "Dar Chhiwa",
  published: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("domain-specific localizers", () => {
  it("localizes category names", () => {
    expect(categoryName(category, "en")).toBe("Tagines");
    expect(categoryName(category, "ar")).toBe("طواجن");
  });

  it("localizes menu item name and description", () => {
    expect(itemName(item, "en")).toBe("Chicken Tagine");
    expect(itemDescription(item, "ar")).toBe("طاجين مطبوخ بالزيتون والليمون المخلل");
  });

  it("localizes blog post title and excerpt", () => {
    expect(postTitle(post, "en")).toBe("Title");
    expect(postExcerpt(post, "fr")).toBe("Extrait");
  });
});
