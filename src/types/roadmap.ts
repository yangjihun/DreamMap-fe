export type RoadmapPeriod = "3months" | "6months" | "1year";

export interface Roadmap {
  id: string;
  period: RoadmapPeriod;
  paths: Path[];
}

export interface Path {
  id: string;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  resources: Resource[];
}

export interface Resource {
  id: string;
  resourceType: "course" | "study";
  name: string;
  location: string;
  price: string;
  rating: number;
  provider: string;
  url?: string;
}
