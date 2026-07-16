import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

const img = (seed) => `https://picsum.photos/seed/${seed}/600/450`;

async function main() {
  const adminPass = await bcrypt.hash("admin123", 10);
  const customerPass = await bcrypt.hash("client123", 10);

  const categories = [
    { id: uuid(), name: "Tajines", nameAr: "طاجين", nameEn: "Tagines", icon: "cook-pot", order: 1 },
    { id: uuid(), name: "Grillades", nameAr: "مشوي", nameEn: "Grills", icon: "flame", order: 2 },
    { id: uuid(), name: "Sandwichs & Snacks", nameAr: "سندويشات", nameEn: "Sandwiches & Snacks", icon: "sandwich", order: 3 },
    { id: uuid(), name: "Pizza", nameAr: "بيتزا", nameEn: "Pizza", icon: "pizza", order: 4 },
    { id: uuid(), name: "Salades", nameAr: "سلطة", nameEn: "Salads", icon: "salad", order: 5 },
    { id: uuid(), name: "Boissons", nameAr: "مشروبات", nameEn: "Drinks", icon: "cup-soda", order: 6 },
    { id: uuid(), name: "Desserts", nameAr: "حلويات", nameEn: "Desserts", icon: "cake-slice", order: 7 },
  ];

  const byName = Object.fromEntries(categories.map((c) => [c.name, c.id]));

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
      descEn: "Grilled merguez sausage, fresh salad, fries and house sauce." },
    { cat: "Sandwichs & Snacks", price: 22, tags: [], spicy: 1, featured: false,
      name: "Sandwich Kefta", nameAr: "سندويش كفتة", nameEn: "Kefta Sandwich",
      desc: "Kefta, fromage fondu et salade marinée.",
      descAr: "كفتة، جبن وسلطة مشرملة.",
      descEn: "Kefta, melted cheese and marinated salad." },
    { cat: "Sandwichs & Snacks", price: 30, tags: ["populaire"], spicy: 1, featured: true,
      name: "Tacos Poulet", nameAr: "تاكوس دجاج", nameEn: "Chicken Tacos",
      desc: "Poulet, frites, fromage fondu et sauce algérienne.",
      descAr: "دجاج، بطاطا مقلية، جبن وصلصة جزائرية.",
      descEn: "Chicken, fries, melted cheese and Algerian sauce." },
    { cat: "Pizza", price: 45, tags: [], spicy: 0, featured: false,
      name: "Pizza Margherita", nameAr: "بيتزا مارغريتا", nameEn: "Margherita Pizza",
      desc: "Sauce tomate, mozzarella fondante et basilic frais.",
      descAr: "صلصة الطماطم، الموزاريلا والريحان الطازج.",
      descEn: "Tomato sauce, melted mozzarella and fresh basil." },
    { cat: "Pizza", price: 60, tags: ["chef"], spicy: 0, featured: true,
      name: "Pizza 4 Fromages", nameAr: "بيتزا 4 أجبان", nameEn: "Four Cheese Pizza",
      desc: "Mélange de 4 fromages fondants sur une base crème.",
      descAr: "مزيج من 4 أنواع جبن على صلصة الكريمة.",
      descEn: "A blend of 4 melted cheeses on a creamy base." },
    { cat: "Pizza", price: 70, tags: [], spicy: 1, featured: false,
      name: "Pizza Fruits de Mer", nameAr: "بيتزا المأكولات البحرية", nameEn: "Seafood Pizza",
      desc: "Crevettes, calamars et sauce tomate légèrement épicée.",
      descAr: "قريدس، كاليمار وصلصة طماطم متبلة.",
      descEn: "Shrimp, calamari and lightly spiced tomato sauce." },
    { cat: "Salades", price: 35, tags: [], spicy: 0, featured: false,
      name: "Salade César", nameAr: "سلطة سيزار", nameEn: "Caesar Salad",
      desc: "Poulet grillé, parmesan, croûtons et sauce César.",
      descAr: "دجاج مشوي، جبن البارميزان وصلصة سيزار.",
      descEn: "Grilled chicken, parmesan, croutons and Caesar dressing." },
    { cat: "Salades", price: 20, tags: [], spicy: 0, featured: false,
      name: "Salade Marocaine", nameAr: "سلطة مغربية", nameEn: "Moroccan Salad",
      desc: "Tomates, concombre, oignon et huile d'olive.",
      descAr: "طماطم، خيار، بصل وزيت الزيتون.",
      descEn: "Tomatoes, cucumber, onion and olive oil." },
    { cat: "Boissons", price: 8, tags: [], spicy: 0, featured: false,
      name: "Coca-Cola 33cl", nameAr: "كوكا كولا", nameEn: "Coca-Cola 33cl",
      desc: "Boisson gazeuse fraîche.",
      descAr: "مشروب غازي بارد.",
      descEn: "Chilled soft drink." },
    { cat: "Boissons", price: 15, tags: [], spicy: 0, featured: false,
      name: "Jus d'Orange Frais", nameAr: "عصير برتقال طازج", nameEn: "Fresh Orange Juice",
      desc: "Jus d'orange 100% naturel pressé minute.",
      descAr: "عصير برتقال طبيعي 100%.",
      descEn: "100% natural freshly squeezed orange juice." },
    { cat: "Boissons", price: 10, tags: ["populaire"], spicy: 0, featured: true,
      name: "Thé à la Menthe", nameAr: "أتاي بالنعناع", nameEn: "Mint Tea",
      desc: "Thé marocain traditionnel à la menthe fraîche.",
      descAr: "أتاي مغربي أصيل بالنعناع الطازج.",
      descEn: "Traditional Moroccan tea with fresh mint." },
    { cat: "Desserts", price: 18, tags: [], spicy: 0, featured: false,
      name: "Msemen au Miel", nameAr: "مسمن بالعسل", nameEn: "Msemen with Honey",
      desc: "Msemen chaud servi avec du miel et du beurre.",
      descAr: "مسمن سخون مع العسل والزبدة.",
      descEn: "Warm msemen served with honey and butter." },
    { cat: "Desserts", price: 20, tags: [], spicy: 0, featured: false,
      name: "Chebakia", nameAr: "شباكية", nameEn: "Chebakia",
      desc: "Pâtisserie traditionnelle au miel et graines de sésame.",
      descAr: "حلوى تقليدية بالعسل والسمسم.",
      descEn: "Traditional pastry with honey and sesame seeds." },
    { cat: "Desserts", price: 28, tags: ["chef"], spicy: 0, featured: true,
      name: "Fondant au Chocolat", nameAr: "فوندان بالشوكولاطة", nameEn: "Chocolate Fondant",
      desc: "Gâteau au chocolat chaud et coulant, servi avec glace vanille.",
      descAr: "كيك شوكولاطة سخون سائل، مع مثلجات الفانيليا.",
      descEn: "Warm molten chocolate cake, served with vanilla ice cream." },
  ];

  const menuItems = items.map((it, i) => ({
    id: uuid(),
    categoryId: byName[it.cat],
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
  }));

  const users = [
    {
      id: uuid(),
      name: "Admin Dar Chhiwa",
      email: "admin@darchhiwa.ma",
      passwordHash: adminPass,
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: uuid(),
      name: "Client Demo",
      email: "client@darchhiwa.ma",
      phone: "+212600000001",
      passwordHash: customerPass,
      role: "customer",
      createdAt: new Date().toISOString(),
    },
  ];

  const db = {
    users,
    categories,
    menuItems,
    orders: [],
    settings: {
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
  };

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  console.log("Seed dyal la base de données temmat b najah!");
  console.log("Admin: admin@darchhiwa.ma / admin123");
  console.log("Client: client@darchhiwa.ma / client123");
}

main();
