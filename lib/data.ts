// Demo dataset for the Vernis prototype. Swap with a real CMS / DB later.

export type Artist = {
  id: string;
  slug: string;
  name: string;
  city: string;
  tagline: string;
  bio: string;
  accent: string; // hex used for fallbacks & accents
  avatarSeed: string;
  followers: number;
};

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  artistId: string;
  year: number;
  medium: string;
  size: string; // cm
  category: "Maľba" | "Ilustrácia" | "Fotografia" | "Print";
  price: number; // EUR
  image: string;
  palette: [string, string, string];
  kind: "original" | "limited";
  editionTotal: number; // for original = 1
  editionSold: number;
  /** ISO string; if set the piece is part of a timed drop */
  dropEndsAt?: string;
  baseViewers: number; // seed for the "live viewers" widget
  story: string;
  tags: string[];
};

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1100&q=80`;

export const artists: Artist[] = [
  {
    id: "mira",
    slug: "mira-kovac",
    name: "Mira Kováč",
    city: "Bratislava",
    tagline: "Mestská abstrakcia & svetlo",
    bio: "Maľujem to, čo vidím cez okno električky cestou domov — mesto rozpustené do farebných škvŕn. Akryl, veľa vrstiev, žiadny plán.",
    accent: "#7c4dff",
    avatarSeed: "MK7",
    followers: 4280,
  },
  {
    id: "tomas",
    slug: "tomas-bielik",
    name: "Tomáš Bielik",
    city: "Košice",
    tagline: "Krajiny, ktoré ešte existujú",
    bio: "Chodím po Slovensku s plátnom v aute. Maľujem rýchlo, kým sa svetlo nezmení. Olej, paletový nôž, blato z čižiem.",
    accent: "#25e6b0",
    avatarSeed: "TB3",
    followers: 2960,
  },
  {
    id: "lena",
    slug: "lena-h",
    name: "Lena H.",
    city: "Žilina",
    tagline: "Ilustrácia na hrane sna",
    bio: "Postavy z rozprávok, ktoré nikto nenapísal. Tuš, kvaš, digitálne dotiahnutie. Robím aj limitované riso printy.",
    accent: "#ff5d7d",
    avatarSeed: "LH9",
    followers: 6110,
  },
  {
    id: "you",
    slug: "ty-umelec",
    name: "Tvoje meno",
    city: "Tvoje mesto",
    tagline: "Poloprofesionálny maliar — a toto je tvoj profil",
    bio: "Tu bude tvoj príbeh. Pár viet o tom, prečo maľuješ, čím, a čo ťa baví. Kupujúci milujú príbeh za obrazom — predáva sa lepšie ako technika.",
    accent: "#f0b429",
    avatarSeed: "TY1",
    followers: 1240,
  },
];

export const artworks: Artwork[] = [
  {
    id: "a1",
    slug: "elektricka-cislo-9",
    title: "Električka č. 9",
    artistId: "mira",
    year: 2025,
    medium: "Akryl na plátne",
    size: "80 × 100 cm",
    category: "Maľba",
    price: 540,
    image: U("1549887534-1541e9326642"),
    palette: ["#7c4dff", "#2b1b6b", "#ffd25f"],
    kind: "original",
    editionTotal: 1,
    editionSold: 0,
    dropEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    baseViewers: 23,
    story:
      "Ranná električka, zahmlené okno, neóny obchodov ešte svietia. Maľované cez tri víkendy, posledná vrstva mokrá do mokrého.",
    tags: ["mesto", "ráno", "modrá"],
  },
  {
    id: "a2",
    slug: "popolud-nad-strechami",
    title: "Popoludnie nad strechami",
    artistId: "mira",
    year: 2024,
    medium: "Akryl & pastel",
    size: "60 × 60 cm",
    category: "Maľba",
    price: 320,
    image: U("1536924940846-227afb31e2a5"),
    palette: ["#ff8a5b", "#7c4dff", "#1c1733"],
    kind: "original",
    editionTotal: 1,
    editionSold: 0,
    baseViewers: 11,
    story: "Strechy Starého mesta, keď slnko padá nízko a všetko je zrazu oranžové.",
    tags: ["mesto", "leto", "oranžová"],
  },
  {
    id: "a3",
    slug: "tatry-pred-burkou",
    title: "Tatry pred búrkou",
    artistId: "tomas",
    year: 2025,
    medium: "Olej na plátne",
    size: "100 × 70 cm",
    category: "Maľba",
    price: 690,
    image: U("1470770841072-f978cf4d019e"),
    palette: ["#1f4f4a", "#0b1a1f", "#9fe7d5"],
    kind: "original",
    editionTotal: 1,
    editionSold: 0,
    dropEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 5.5).toISOString(),
    baseViewers: 41,
    story:
      "Tridsať minút na hrebeni, kým prišiel dážď. Paletový nôž, takmer žiadne štetce. Cítiť v tom vietor.",
    tags: ["hory", "búrka", "zelená"],
  },
  {
    id: "a4",
    slug: "rieka-v-auguste",
    title: "Rieka v auguste",
    artistId: "tomas",
    year: 2024,
    medium: "Olej na dreve",
    size: "40 × 30 cm",
    category: "Maľba",
    price: 240,
    image: U("1500530855697-b586d89ba3ee"),
    palette: ["#2fa98c", "#0e2a26", "#ffe3a3"],
    kind: "original",
    editionTotal: 1,
    editionSold: 0,
    baseViewers: 7,
    story: "Hron pri Banskej Bystrici. Voda tak nízko, že vidno kamene. Maľované na mieste za jedno popoludnie.",
    tags: ["rieka", "leto", "malé"],
  },
  {
    id: "a5",
    slug: "divka-ktora-pocuva-les",
    title: "Dievča, ktoré počúva les",
    artistId: "lena",
    year: 2025,
    medium: "Tuš a kvaš na papieri",
    size: "50 × 70 cm",
    category: "Ilustrácia",
    price: 290,
    image: U("1578321272176-b7bbc0679853"),
    palette: ["#ff5d7d", "#2a1530", "#ffd25f"],
    kind: "original",
    editionTotal: 1,
    editionSold: 0,
    dropEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 50).toISOString(),
    baseViewers: 33,
    story: "Z nedokončenej knihy. Mala počúvať, čo jej stromy povedia — a oni mlčali. Aj to je odpoveď.",
    tags: ["postava", "les", "ružová"],
  },
  {
    id: "a6",
    slug: "nocny-trh-riso",
    title: "Nočný trh (riso print)",
    artistId: "lena",
    year: 2025,
    medium: "Risografia, 3 farby",
    size: "30 × 40 cm",
    category: "Print",
    price: 45,
    image: U("1531913764164-f85c52e6e654"),
    palette: ["#ff5d7d", "#7c4dff", "#1c1733"],
    kind: "limited",
    editionTotal: 50,
    editionSold: 41,
    dropEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    baseViewers: 58,
    story: "Limitovaná séria 50 kusov, každý ručne číslovaný a podpísaný. Keď je preč, je preč.",
    tags: ["print", "noc", "limitka"],
  },
  {
    id: "a7",
    slug: "more-svetla-print",
    title: "More svetla (print)",
    artistId: "mira",
    year: 2024,
    medium: "Giclée print, archívny papier",
    size: "50 × 50 cm",
    category: "Print",
    price: 60,
    image: U("1547891654-e66ed7ebb968"),
    palette: ["#38bdf8", "#1c1733", "#ffd25f"],
    kind: "limited",
    editionTotal: 100,
    editionSold: 64,
    baseViewers: 19,
    story: "Reprodukcia obľúbeného originálu — pre tých, čo nestihli ten pravý. Edícia 100 ks.",
    tags: ["print", "modrá"],
  },
  {
    id: "a8",
    slug: "hmla-nad-poliami-foto",
    title: "Hmla nad poliami",
    artistId: "tomas",
    year: 2025,
    medium: "Fine-art fotografia, edícia",
    size: "60 × 40 cm",
    category: "Fotografia",
    price: 130,
    image: U("1500382017468-9049fed747ef"),
    palette: ["#9fb5a8", "#1a241f", "#e7d8a8"],
    kind: "limited",
    editionTotal: 25,
    editionSold: 9,
    baseViewers: 14,
    story: "5:40 ráno, niekde za Prešovom. Edícia 25 ks na bavlnenom papieri, s certifikátom.",
    tags: ["foto", "ráno", "hmla"],
  },
  {
    id: "a9",
    slug: "autoportret-v-daždi",
    title: "Autoportrét v daždi",
    artistId: "you",
    year: 2025,
    medium: "Akryl na plátne",
    size: "70 × 90 cm",
    category: "Maľba",
    price: 380,
    image: U("1579783902614-a3fb3927b6a5"),
    palette: ["#f0b429", "#1c1733", "#7c4dff"],
    kind: "original",
    editionTotal: 1,
    editionSold: 0,
    dropEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    baseViewers: 27,
    story: "Tvoj obraz, tvoj príbeh. Sem napíš, čo si vtedy cítil — kupujúci to chcú vedieť.",
    tags: ["postava", "dážď", "žltá"],
  },
  {
    id: "a10",
    slug: "zatisie-s-pomarancami",
    title: "Zátišie s pomarančami",
    artistId: "you",
    year: 2024,
    medium: "Olej na plátne",
    size: "40 × 40 cm",
    category: "Maľba",
    price: 220,
    image: U("1582561424760-0321d75e81fa"),
    palette: ["#ff8a5b", "#2a1a12", "#ffd25f"],
    kind: "original",
    editionTotal: 1,
    editionSold: 0,
    baseViewers: 6,
    story: "Klasika v ateliéri o tretej ráno, keď sa nedalo spať. Vôňa terpentínu a pomarančov.",
    tags: ["zátišie", "teplá"],
  },
  {
    id: "a11",
    slug: "mesto-co-snivalo",
    title: "Mesto, čo snívalo",
    artistId: "lena",
    year: 2025,
    medium: "Digitálna ilustrácia, print",
    size: "40 × 50 cm",
    category: "Print",
    price: 38,
    image: U("1543857778-c4a1a3e0b2eb"),
    palette: ["#7c4dff", "#0b0913", "#ff5d7d"],
    kind: "limited",
    editionTotal: 80,
    editionSold: 72,
    dropEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    baseViewers: 44,
    story: "Posledných pár kusov z edície 80. Ručne číslované. Potom už len v múzeu (žartujem… alebo nie).",
    tags: ["print", "noc", "limitka"],
  },
  {
    id: "a12",
    slug: "vrch-v-zime-foto",
    title: "Vrch v zime",
    artistId: "tomas",
    year: 2024,
    medium: "Fine-art fotografia",
    size: "50 × 50 cm",
    category: "Fotografia",
    price: 110,
    image: U("1483728642387-6c3bdd6c93e5"),
    palette: ["#cdd8e3", "#15202b", "#9fb7d4"],
    kind: "limited",
    editionTotal: 30,
    editionSold: 4,
    baseViewers: 9,
    story: "Mráz −14 °C, prsty necítiť, ale to ticho stálo za to. Edícia 30 ks.",
    tags: ["foto", "zima", "modrá"],
  },
];

export function getArtist(id: string): Artist | undefined {
  return artists.find((a) => a.id === id || a.slug === id);
}
export function getArtwork(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug || a.id === slug);
}
export function artworksByArtist(artistId: string): Artwork[] {
  return artworks.filter((a) => a.artistId === artistId);
}
export const categories = ["Všetko", "Maľba", "Ilustrácia", "Fotografia", "Print"] as const;
export const priceBands = [
  { label: "Akákoľvek cena", min: 0, max: Infinity },
  { label: "do 50 €", min: 0, max: 50 },
  { label: "50–200 €", min: 50, max: 200 },
  { label: "200–500 €", min: 200, max: 500 },
  { label: "500 € a viac", min: 500, max: Infinity },
] as const;
