export type RoadmapPeriod = "3months" | "6months" | "1year";
export type RoadmapResource = "course" | "study";

export interface Roadmap {
  _id: string;
  period: RoadmapPeriod;
  paths: Path[];
}

export interface Path {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  resources: Resource[];
}

export interface Resource {
  _id: string;
  resourceType: RoadmapResource;
  name: string;
  location: string;
  price: string;
  rating: number;
  provider: string;
  url?: string;
  description?: string;
}
