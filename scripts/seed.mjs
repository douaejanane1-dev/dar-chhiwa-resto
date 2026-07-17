import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const img = (seed) => `https://picsum.photos/seed/${seed}/600/450`;

async function main() {
  const adminPass = await bcrypt.hash("admin123", 10);
  const customerPass = await bcrypt.hash("client123", 10);

  const categoriesData = [
    { name: "Tajines", nameAr: "طاجين", nameEn: "Tagines", icon: "cook-pot", order: 1 },
    { name: "Grillades", nameAr: "مشوي", nameEn: "Grills", icon: "flame", order: 2 },
    { name: "Sandwichs & Snacks", nameAr: "سندويشات", nameEn: "Sandwiches & Snacks", icon: "sandwich", order: 3 },
    { name: "Pizza", nameAr: "بيتزا", nameEn: "Pizza", icon: "pizza", order: 4 },
    { name: "Salades", nameAr: "سلطة", nameEn: "Salads", icon: "salad", order: 5 },
    { name: "Boissons", nameAr: "مشروبات", nameEn: "Drinks", icon: "cup-soda", order: 6 },
    { name: "Desserts", nameAr: "حلويات", nameEn: "Desserts", icon: "cake-slice", order: 7 },
  ];

  const items = [
    { cat: "Tajines", price: 55, tags: ["populaire"], spicy: 1, featured: true,
      name: "Tajine Kefta aux Œufs", nameAr: "طاجين كفتة بالبيض", nameEn: "Kefta Tagine with Eggs",
      desc: "Boulettes de viande épicées mijotées dans une sauce tomate relevée, œufs et olives.",
      descAr: "كفتة متبلة مطبوخة فصلصة حمراء، مع البيض والزيتون.",
      descEn: "Spiced meatballs simmered in a rich tomato sauce with eggs and olives." },
    { cat: "Tajines", price: 65, tags: ["chef"], spicy: 0, featured: true,
      name: "Tajine de Poulet aux Olives", nameAr: "طاجين الدجاج بالزيتون", nameEn: "Chicken Tagine with Olives",
      desc: "Poulet fermier mijoté avec olives vertes, citron confit et épices marocaines.",
      descAr: "دجاج بلدي مطبوخ مع الزيتون الأخضر والحامض المرقد.",
      descEn: "Free-range chicken simmered with green olives, preserved lemon and Moroccan spices." },
    { cat: "Tajines", price: 80, tags: [], spicy: 0, featured: false,
      name: "Tajine de Veau aux Pruneaux", nameAr: "طاجين اللحم بالبرقوق", nameEn: "Veal Tagine with Prunes",
      desc: "Veau fondant mijoté avec pruneaux et amandes grillées, sauce légèrement sucrée-salée.",
      descAr: "لحم العجل مطبوخ مع البرقوق واللوز المحمص.",
      descEn: "Tender veal slow-cooked with prunes and toasted almonds, sweet-savory sauce." },
    { cat: "Grillades", price: 60, tags: ["populaire"], spicy: 1, featured: true,
      name: "Brochettes Marinées", nameAr: "بروشيت مشوية", nameEn: "Marinated Skewers",
      desc: "Brochettes de bœuf marinées aux épices, grillées au charbon de bois.",
      descAr: "بروشيت لحم متبل، مشوي على الفحم.",
      descEn: "Beef skewers marinated in spices, chargrilled over charcoal." },
    { cat: "Grillades", price: 50, tags: [], spicy: 2, featured: false,
      name: "Kefta Grillée", nameAr: "كفتة مشوية", nameEn: "Grilled Kefta",
      desc: "Kefta traditionnelle grillée, servie avec frites et salade fraîche.",
      descAr: "كفتة بلدية مشوية، مع البطاطا المقلية والسلطة.",
      descEn: "Traditional grilled kefta, served with fries and fresh salad." },
    { cat: "Grillades", price: 58, tags: [], spicy: 0, featured: false,
      name: "Poulet Grillé", nameAr: "دجاج مشوي", nameEn: "Grilled Chicken",
      desc: "Quart de poulet mariné à la chermoula, grillé à point.",
      descAr: "ربع دجاج متبل بالشرمولة، مشوي.",
      descEn: "Quarter chicken marinated in chermoula, perfectly grilled." },
    { cat: "Sandwichs & Snacks", price: 25, tags: ["populaire"], spicy: 2, featured: true,
      name: "Sandwich Merguez", nameAr: "سندويش ميرغيز", nameEn: "Merguez Sandwich",
      desc: "Merguez grillée, salade fraîche, frites et sauce maison.",
      descAr: "ميرغيز، سلطة، بطاطا مقلية وصلصة خاصة.",
      descEn: "Grilled merguez, fresh salad, fries and house sauce." },
    { cat: "Sandwichs & Snacks", price: 20, tags: [], spicy: 0, featured: false,
      name: "Sandwich Poulet Panné", nameAr: "سندويش دجاج مقرمش", nameEn: "Crispy Chicken Sandwich",
      desc: "Escalope de poulet panée, salade, sauce fromagère.",
      descAr: "دجاج مقرمش، سلطة، صلصة الجبن.",
      descEn: "Breaded chicken cutlet, salad, cheese sauce." },
    { cat: "Pizza", price: 45, tags: ["populaire"], spicy: 0, featured: true,
      name: "Pizza Margherita", nameAr: "بيتزا مارغريتا", nameEn: "Margherita Pizza",
      desc: "Sauce tomate, mozzarella fondante, basilic frais.",
      descAr: "صلصة الطماطم، جبن الموزاريلا، الريحان الطازج.",
      descEn: "Tomato sauce, melted mozzarella, fresh basil." },
    { cat: "Pizza", price: 55, tags: [], spicy: 1, featured: false,
      name: "Pizza Merguez", nameAr: "بيتزا ميرغيز", nameEn: "Merguez Pizza",
      desc: "Merguez épicée, poivrons, oignons, mozzarella.",
      descAr: "ميرغيز متبلة، فليفلة، بصل، موزاريلا.",
      descEn: "Spiced merguez, peppers, onions, mozzarella." },
    { cat: "Salades", price: 30, tags: [], spicy: 0, featured: false,
      name: "Salade Marocaine", nameAr: "سلطة مغربية", nameEn: "Moroccan Salad",
      desc: "Tomates, concombres, oignons, coriandre, huile d'olive.",
      descAr: "طماطم، خيار، بصل، كزبرة، زيت الزيتون.",
      descEn: "Tomatoes, cucumbers, onions, coriander, olive oil." },
    { cat: "Salades", price: 40, tags: ["chef"], spicy: 0, featured: false,
      name: "Salade César au Poulet", nameAr: "سلطة سيزار بالدجاج", nameEn: "Chicken Caesar Salad",
      desc: "Poulet grillé, laitue romaine, parmesan, croutons, sauce césar.",
      descAr: "دجاج مشوي، خس، جبن البارميزان، صلصة السيزار.",
      descEn: "Grilled chicken, romaine lettuce, parmesan, croutons, caesar dressing." },
    { cat: "Boissons", price: 12, tags: [], spicy: 0, featured: false,
      name: "Jus d'Orange Frais", nameAr: "عصير برتقال طازج", nameEn: "Fresh Orange Juice",
      desc: "Pressé minute, 100% naturel.",
      descAr: "معصور طازج، 100% طبيعي.",
      descEn: "Freshly squeezed, 100% natural." },
    { cat: "Boissons", price: 8, tags: [], spicy: 0, featured: false,
      name: "Thé à la Menthe", nameAr: "أتاي بالنعناع", nameEn: "Mint Tea",
      desc: "Thé vert traditionnel à la menthe fraîche.",
      descAr: "أتاي أخضر تقليدي بالنعناع الطازج.",
      descEn: "Traditional green tea with fresh mint." },
    { cat: "Desserts", price: 18, tags: ["populaire"], spicy: 0, featured: true,
      name: "Chebakia", nameAr: "شباكية", nameEn: "Chebakia",
      desc: "Pâtisserie marocaine au miel et sésame, faite maison.",
      descAr: "حلوى مغربية بالعسل والسمسم، صنع منزلي.",
      descEn: "Homemade Moroccan pastry with honey and sesame." },
    { cat: "Desserts", price: 22, tags: [], spicy: 0, featured: false,
      name: "Cornes de Gazelle", nameAr: "كعب الغزال", nameEn: "Gazelle Horns",
      desc: "Pâte d'amande parfumée à la fleur d'oranger.",
      descAr: "عجينة اللوز بنكهة زهر البرتقال.",
      descEn: "Almond paste flavored with orange blossom." },
    { cat: "Sandwichs & Snacks", price: 22, tags: [], spicy: 1, featured: false,
      name: "Panini Kefta", nameAr: "بانيني كفتة", nameEn: "Kefta Panini",
      desc: "Kefta grillée, fromage fondu, pain panini croustillant.",
      descAr: "كفتة مشوية، جبن مذاب، خبز باني مقرمش.",
      descEn: "Grilled kefta, melted cheese, crispy panini bread." },
    { cat: "Grillades", price: 90, tags: ["chef"], spicy: 0, featured: true,
      name: "Mixed Grill Royal", nameAr: "مشاوي مشكلة رويال", nameEn: "Royal Mixed Grill",
      desc: "Assortiment de brochettes, merguez et kefta, riz et légumes grillés.",
      descAr: "تشكيلة بروشيت، ميرغيز وكفتة، أرز وخضار مشوية.",
      descEn: "Assortment of skewers, merguez and kefta, rice and grilled vegetables." },
    { cat: "Pizza", price: 60, tags: [], spicy: 0, featured: false,
      name: "Pizza 4 Fromages", nameAr: "بيتزا 4 أجبان", nameEn: "4-Cheese Pizza",
      desc: "Mozzarella, gouda, chèvre, parmesan.",
      descAr: "موزاريلا، غودا، جبن الماعز، بارميزان.",
      descEn: "Mozzarella, gouda, goat cheese, parmesan." },
    { cat: "Boissons", price: 10, tags: [], spicy: 0, featured: false,
      name: "Eau Minérale", nameAr: "ماء معدني", nameEn: "Mineral Water",
      desc: "Bouteille 50cl.",
      descAr: "قنينة 50 سل.",
      descEn: "50cl bottle." },
  ];

  await prisma.$transaction(async (tx) => {
    // Reset (idempotent re-seed) — order matters for FK constraints.
    await tx.orderItem.deleteMany();
    await tx.order.deleteMany();
    await tx.review.deleteMany();
    await tx.reservation.deleteMany();
    await tx.customer.deleteMany();
    await tx.menuItem.deleteMany();
    await tx.category.deleteMany();
    await tx.blogPost.deleteMany();
    await tx.user.deleteMany();
    await tx.restaurantSettings.deleteMany();

    const createdCategories = {};
    for (const c of categoriesData) {
      const created = await tx.category.create({ data: c });
      createdCategories[c.name] = created.id;
    }

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      await tx.menuItem.create({
        data: {
          categoryId: createdCategories[it.cat],
          name: it.name,
          nameAr: it.nameAr,
          nameEn: it.nameEn,
          description: it.desc,
          descriptionAr: it.descAr,
          descriptionEn: it.descEn,
          price: it.price,
          image: img(`resto-item-${i}`),
          isAvailable: true,
          isFeatured: !!it.featured,
          spicyLevel: it.spicy,
          tags: it.tags,
        },
      });
    }

    await tx.user.create({
      data: {
        name: "Admin Dar Chhiwa",
        email: "admin@darchhiwa.ma",
        passwordHash: adminPass,
        role: "admin",
      },
    });
    await tx.user.create({
      data: {
        name: "Client Demo",
        email: "client@darchhiwa.ma",
        phone: "+212600000001",
        passwordHash: customerPass,
        role: "customer",
      },
    });

    await tx.restaurantSettings.create({
      data: {
        id: "default",
        name: "Dar Chhiwa",
        nameAr: "دار الشهيوة",
        nameEn: "Dar Chhiwa",
        tagline: "Le goût authentique, à votre porte",
        taglineAr: "الطعم الأصيل، على بابك",
        taglineEn: "Authentic taste, at your door",
        description:
          "Cuisine marocaine authentique, preparee chaque jour avec des ingredients frais et des recettes familiales. Livraison rapide jusqu'a votre porte.",
        descriptionAr: "مطبخ مغربي أصيل، طبخ يومي بمكونات طازجة ووصفات عائلية. توصيل سريع لباب الدار.",
        descriptionEn: "Authentic Moroccan cuisine, cooked daily with fresh ingredients and family recipes. Fast delivery to your door.",
        logo: "",
        coverImage: img("resto-hero"),
        phone: "+212 6 00 00 00 00",
        email: "contact@darchhiwa.ma",
        address: "Zenkat Al Massira, Hay Al Farah",
        city: "Casablanca",
        lat: 33.5731,
        lng: -7.5898,
        openingHours: "Tous les jours: 11h00 - 23h30",
        deliveryFee: 15,
        minOrder: 60,
        currency: "MAD",
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
      },
    });

    await tx.blogPost.create({
      data: {
        slug: "secrets-of-moroccan-tagine",
        title: "Les secrets d'un tagine marocain reussi",
        titleAr: "أسرار طاجين مغربي ناجح",
        titleEn: "Secrets of a Successful Moroccan Tagine",
        excerpt: "Decouvrez les techniques traditionnelles pour un tagine parfait a chaque fois.",
        excerptAr: "اكتشف التقنيات التقليدية لطاجين مثالي في كل مرة.",
        excerptEn: "Discover the traditional techniques for a perfect tagine every time.",
        content: "Le secret d'un bon tagine reside dans la cuisson lente et les epices fraiches...",
        contentAr: "يكمن سر الطاجين الجيد في الطهي البطيء والتوابل الطازجة...",
        contentEn: "The secret of a good tagine lies in slow cooking and fresh spices...",
        coverImage: "/uploads/blog-tagine.jpg",
        author: "Dar Chhiwa",
        published: true,
      },
    });
  });

  console.log("Seed dyal la base de données temmat b najah! (PostgreSQL)");
  console.log("Admin: admin@darchhiwa.ma / admin123");
  console.log("Client: client@darchhiwa.ma / client123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
