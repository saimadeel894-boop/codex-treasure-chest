export type ListingMode = "Buy" | "Rent";

export type Property = {
  id: string;
  title: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  mode: ListingMode;
  propertyType: string;
  price: number;
  priceLabel: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  landSize: string;
  description: string;
  images: string[];
  features: string[];
  inspectionTimes: string[];
  agentId: string;
  agencyId: string;
  tags: string[];
  listedAt: string;
};

export type Agent = {
  id: string;
  name: string;
  title: string;
  agencyId: string;
  phone: string;
  email: string;
  image: string;
  rating: number;
  activeListings: number;
  soldLastYear: number;
  bio: string;
  specialities: string[];
};

export type Agency = {
  id: string;
  name: string;
  initials: string;
  suburb: string;
  state: string;
  phone: string;
  email: string;
  heroImage: string;
  description: string;
  stats: {
    listings: number;
    agents: number;
    years: number;
  };
};

export type BlogPost = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
};

export const agencies: Agency[] = [
  {
    id: "harbour-north",
    name: "Harbour North Property",
    initials: "HN",
    suburb: "Mosman",
    state: "NSW",
    phone: "02 8012 4410",
    email: "hello@harbournorth.example",
    heroImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=80",
    description:
      "A boutique Sydney team focused on premium family homes, waterfront apartments, and data-led campaign strategy.",
    stats: {
      listings: 42,
      agents: 12,
      years: 18,
    },
  },
  {
    id: "capital-lane",
    name: "Capital Lane Realty",
    initials: "CL",
    suburb: "South Yarra",
    state: "VIC",
    phone: "03 9020 7711",
    email: "team@capitallane.example",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80",
    description:
      "Melbourne specialists for high-performing inner-city residences, townhouses, and investment-grade apartments.",
    stats: {
      listings: 58,
      agents: 16,
      years: 14,
    },
  },
  {
    id: "coastline-estate",
    name: "Coastline Estate Co.",
    initials: "CE",
    suburb: "Noosa Heads",
    state: "QLD",
    phone: "07 5442 8100",
    email: "sales@coastlineestate.example",
    heroImage:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80",
    description:
      "A coastal agency pairing local lifestyle knowledge with sharp digital campaigns for premium Queensland homes.",
    stats: {
      listings: 35,
      agents: 9,
      years: 11,
    },
  },
];

export const agents: Agent[] = [
  {
    id: "mia-carter",
    name: "Mia Carter",
    title: "Principal Agent",
    agencyId: "harbour-north",
    phone: "0402 118 772",
    email: "mia.carter@example.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    activeListings: 14,
    soldLastYear: 46,
    bio: "Mia combines neighbourhood knowledge with calm negotiation and a polished campaign process for Sydney's lower north shore.",
    specialities: ["Family homes", "Auction strategy", "Prestige apartments"],
  },
  {
    id: "ethan-brooks",
    name: "Ethan Brooks",
    title: "Senior Sales Consultant",
    agencyId: "capital-lane",
    phone: "0418 633 910",
    email: "ethan.brooks@example.com",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    activeListings: 18,
    soldLastYear: 53,
    bio: "Ethan helps buyers and sellers read Melbourne's apartment and townhouse market with clear pricing and campaign advice.",
    specialities: ["Townhouses", "Investor stock", "Off-market buyers"],
  },
  {
    id: "amelia-wright",
    name: "Amelia Wright",
    title: "Coastal Property Partner",
    agencyId: "coastline-estate",
    phone: "0431 440 225",
    email: "amelia.wright@example.com",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    activeListings: 11,
    soldLastYear: 38,
    bio: "Amelia works with lifestyle buyers, developers, and downsizers across Noosa and the Sunshine Coast.",
    specialities: ["Beach homes", "New developments", "Lifestyle buyers"],
  },
];

export const properties: Property[] = [
  {
    id: "mosman-family-retreat",
    title: "Architectural Family Retreat Near Balmoral",
    address: "24 Awaba Street",
    suburb: "Mosman",
    state: "NSW",
    postcode: "2088",
    mode: "Buy",
    propertyType: "House",
    price: 4250000,
    priceLabel: "$4,250,000",
    bedrooms: 5,
    bathrooms: 3,
    parking: 2,
    landSize: "612 sqm",
    description:
      "A refined family residence with generous living zones, landscaped entertaining spaces, and an elevated north-facing outlook moments from village cafes and harbour beaches.",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    ],
    features: ["Pool", "Study", "Outdoor kitchen", "North aspect", "Ducted air conditioning"],
    inspectionTimes: ["Sat 11:00 am - 11:45 am", "Wed 5:30 pm - 6:00 pm"],
    agentId: "mia-carter",
    agencyId: "harbour-north",
    tags: ["New", "Auction ready"],
    listedAt: "Listed today",
  },
  {
    id: "south-yarra-townhouse",
    title: "Designer Townhouse With Private Rooftop",
    address: "8/19 Chapel Mews",
    suburb: "South Yarra",
    state: "VIC",
    postcode: "3141",
    mode: "Buy",
    propertyType: "Townhouse",
    price: 1725000,
    priceLabel: "$1,725,000",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    landSize: "214 sqm",
    description:
      "A low-maintenance city-edge home with warm interiors, flexible work-from-home space, and a private rooftop terrace made for entertaining.",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
    ],
    features: ["Rooftop terrace", "Secure parking", "Study nook", "Integrated appliances"],
    inspectionTimes: ["Sat 1:00 pm - 1:30 pm"],
    agentId: "ethan-brooks",
    agencyId: "capital-lane",
    tags: ["Private sale"],
    listedAt: "Listed 2 days ago",
  },
  {
    id: "noosa-beachside-apartment",
    title: "Beachside Apartment With Ocean Breezes",
    address: "12/6 Hastings Parade",
    suburb: "Noosa Heads",
    state: "QLD",
    postcode: "4567",
    mode: "Rent",
    propertyType: "Apartment",
    price: 980,
    priceLabel: "$980 per week",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    landSize: "116 sqm",
    description:
      "Fully furnished coastal apartment with a generous balcony, leafy outlook, and easy access to beaches, restaurants, and weekend markets.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
    ],
    features: ["Furnished", "Balcony", "Air conditioning", "Secure building"],
    inspectionTimes: ["Thu 4:15 pm - 4:45 pm", "Sat 9:30 am - 10:00 am"],
    agentId: "amelia-wright",
    agencyId: "coastline-estate",
    tags: ["Available now"],
    listedAt: "Listed yesterday",
  },
  {
    id: "perth-riverside-home",
    title: "Riverside Home With Flexible Family Living",
    address: "41 Canning Beach Road",
    suburb: "Applecross",
    state: "WA",
    postcode: "6153",
    mode: "Buy",
    propertyType: "House",
    price: 2380000,
    priceLabel: "$2,380,000",
    bedrooms: 4,
    bathrooms: 2,
    parking: 2,
    landSize: "548 sqm",
    description:
      "A light-filled residence with multiple living spaces, a landscaped garden, and easy access to river walks, schools, and village dining.",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    ],
    features: ["Garden", "Solar panels", "Walk-in pantry", "River precinct"],
    inspectionTimes: ["Sun 10:30 am - 11:15 am"],
    agentId: "mia-carter",
    agencyId: "harbour-north",
    tags: ["Family favourite"],
    listedAt: "Listed 4 days ago",
  },
  {
    id: "adelaide-city-apartment",
    title: "City Apartment Above the Parklands",
    address: "1504/18 East Terrace",
    suburb: "Adelaide",
    state: "SA",
    postcode: "5000",
    mode: "Rent",
    propertyType: "Apartment",
    price: 720,
    priceLabel: "$720 per week",
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    landSize: "86 sqm",
    description:
      "A bright apartment with sweeping parkland views, open-plan living, and excellent access to universities, dining, and transport.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
    ],
    features: ["Park views", "Lift access", "Gym", "Secure parking"],
    inspectionTimes: ["Fri 12:15 pm - 12:45 pm"],
    agentId: "ethan-brooks",
    agencyId: "capital-lane",
    tags: ["Inspection added"],
    listedAt: "Listed 1 week ago",
  },
  {
    id: "hobart-heritage-cottage",
    title: "Restored Heritage Cottage With Mountain Views",
    address: "7 Kelly Street",
    suburb: "Battery Point",
    state: "TAS",
    postcode: "7004",
    mode: "Buy",
    propertyType: "House",
    price: 1285000,
    priceLabel: "$1,285,000",
    bedrooms: 3,
    bathrooms: 1,
    parking: 1,
    landSize: "332 sqm",
    description:
      "A character-filled cottage with restored period details, a modern kitchen, and a private courtyard close to Salamanca and the waterfront.",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1200&q=80",
    ],
    features: ["Fireplace", "Courtyard", "Heritage detail", "Mountain views"],
    inspectionTimes: ["Sat 2:30 pm - 3:00 pm"],
    agentId: "amelia-wright",
    agencyId: "coastline-estate",
    tags: ["Character home"],
    listedAt: "Listed 5 days ago",
  },
];

export const popularLocations = [
  { name: "Sydney", state: "NSW", listings: 12840 },
  { name: "Melbourne", state: "VIC", listings: 11620 },
  { name: "Brisbane", state: "QLD", listings: 8240 },
  { name: "Perth", state: "WA", listings: 5930 },
  { name: "Adelaide", state: "SA", listings: 4480 },
  { name: "Hobart", state: "TAS", listings: 1710 },
];

export const states = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export const propertyTypes = ["House", "Apartment", "Townhouse", "Land", "New development"];

export const blogPosts: BlogPost[] = [
  {
    id: "winter-market-watch",
    title: "What buyers are watching in Australia's winter market",
    category: "Market insights",
    excerpt:
      "A practical look at listing supply, inspection behaviour, and how buyers can compare value across suburbs.",
    date: "23 Jun 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "renter-shortlist-guide",
    title: "How to build a faster rental shortlist",
    category: "Renting",
    excerpt:
      "Simple ways to compare rent, transport, inspection times, and application readiness before the weekend rush.",
    date: "18 Jun 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "seller-listing-prep",
    title: "Preparing a property listing that earns enquiries",
    category: "Selling",
    excerpt:
      "Photography, pricing context, floor-plan clarity, and agent response speed all shape campaign performance.",
    date: "12 Jun 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  },
];

export function getPropertyById(id: string) {
  return properties.find((property) => property.id === id) ?? properties[0];
}

export function getAgentById(id: string) {
  return agents.find((agent) => agent.id === id) ?? agents[0];
}

export function getAgencyById(id: string) {
  return agencies.find((agency) => agency.id === id) ?? agencies[0];
}

export function getAgencyForAgent(agentId: string) {
  const agent = getAgentById(agentId);
  return getAgencyById(agent.agencyId);
}

export function getAgentForProperty(property: Property) {
  return getAgentById(property.agentId);
}

export function getAgencyForProperty(property: Property) {
  return getAgencyById(property.agencyId);
}

export function getPropertiesForAgent(agentId: string) {
  return properties.filter((property) => property.agentId === agentId);
}

export function getPropertiesForAgency(agencyId: string) {
  return properties.filter((property) => property.agencyId === agencyId);
}
