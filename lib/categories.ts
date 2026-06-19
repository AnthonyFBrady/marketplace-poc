export type CategoryId =
  | "tools"
  | "camping"
  | "party"
  | "instruments"
  | "sports"
  | "electronics"
  | "baby"
  | "spaces";

export type Category = {
  id: CategoryId;
  label: string;
  emoji: string;
  description: string;
};

export const CATEGORIES: Category[] = [
  { id: "tools", label: "Tools", emoji: "🔧", description: "Power tools, hand tools, ladders, pressure washers" },
  { id: "camping", label: "Camping", emoji: "⛺", description: "Tents, kayaks, sleeping bags, camp kitchen" },
  { id: "party", label: "Party", emoji: "🎉", description: "PA systems, photo booths, tables, chairs" },
  { id: "instruments", label: "Instruments", emoji: "🎸", description: "Guitars, pianos, drums, amps" },
  { id: "sports", label: "Sports", emoji: "🚴", description: "E-bikes, snowboards, paddleboards, skis" },
  { id: "electronics", label: "Electronics", emoji: "📷", description: "Cameras, lenses, projectors, drones" },
  { id: "baby", label: "Baby", emoji: "👶", description: "Strollers, car seats, bouncers, cribs" },
  { id: "spaces", label: "Spaces", emoji: "🏡", description: "Backyards, garages, driveways, studios" },
];

export function getCategoryById(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}
