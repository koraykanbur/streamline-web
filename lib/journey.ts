import { TIMELINES } from "./constants";

export type StageId = "idea" | "source" | "collect" | "consolidate" | "split" | "customs" | "delivered";

export type Stage = {
  id: StageId;
  nav: string;
  /** scroll progress window within the journey section */
  start: number;
  end: number;
  title: string;
  lead: string;
  body: string;
  where: string;
};

export const STAGES: Stage[] = [
  {
    id: "idea",
    nav: "Your idea",
    start: 0,
    end: 0.09,
    title: "“I need this product.”",
    lead: "That's all you have to say.",
    body: "A product, a quantity, a destination. From here, Streamline takes over.",
    where: "Your business, UAE or Saudi Arabia",
  },
  {
    id: "source",
    nav: "Source",
    start: 0.09,
    end: 0.23,
    title: "Source",
    lead: "We find what you need.",
    body: "Tell us what you're looking for and we'll connect you with suppliers across China. We compare, negotiate, and check before anything is made.",
    where: "Shenzhen and suppliers across China",
  },
  {
    id: "collect",
    nav: "Collect",
    start: 0.23,
    end: 0.34,
    title: "Collect",
    lead: "Supplier to warehouse.",
    body: "When your goods are ready, we pick them up from each factory and bring them to our warehouse in Shenzhen.",
    where: "Factories → Shenzhen warehouse",
  },
  {
    id: "consolidate",
    nav: "Consolidate",
    start: 0.34,
    end: 0.44,
    title: "Consolidate",
    lead: "Everything comes together.",
    body: "Products from multiple suppliers are checked, packed, and combined into one shipment. Fewer moving parts for you.",
    where: "Shenzhen warehouse",
  },
  {
    id: "split",
    nav: "Air or sea",
    start: 0.44,
    end: 0.67,
    title: "Air or sea.",
    lead: "You pick the speed. We move it.",
    body: `Air when speed matters: about ${TIMELINES.air} door to door. Sea when cost matters more: about ${TIMELINES.sea}.`,
    where: "China → UAE and Saudi Arabia",
  },
  {
    id: "customs",
    nav: "Customs",
    start: 0.67,
    end: 0.81,
    title: "Customs? Handled.",
    lead: "No forms on your desk.",
    body: "We coordinate customs and clearance so you don't have to worry about the process.",
    where: "Jebel Ali, Dubai airport, Dammam, Riyadh",
  },
  {
    id: "delivered",
    nav: "Delivered",
    start: 0.81,
    end: 1,
    title: "Delivered.",
    lead: "Direct delivery to your destination.",
    body: "Your shop, your warehouse, your office. Same journey that started with one sentence.",
    where: "Your door",
  },
];

export const FREIGHT = {
  air: {
    label: "Air freight",
    time: TIMELINES.air,
    line: "Faster delivery when speed matters.",
    points: ["Faster", "Ideal for urgent shipments"],
    path: ["China", "Airport", "Plane", "UAE / Saudi", "Customs", "Truck", "Door"],
  },
  sea: {
    label: "Sea freight",
    time: TIMELINES.sea,
    line: "Lower cost shipping when timing is more flexible.",
    points: ["Lower shipping costs", "More economical"],
    path: ["China", "Port", "Container ship", "GCC port", "Customs", "Truck", "Door"],
  },
};
