import companiesData from "@/data/companies.json";
import mncsData from "@/data/mncs.json";
import regulatorsData from "@/data/regulators.json";
import academicData from "@/data/academic.json";
import investorsData from "@/data/investors.json";
import hospitalsData from "@/data/hospitals.json";
import exchangesData from "@/data/exchanges.json";
import type { Entity, EntityCategory } from "./types";

export const entities = [
  ...(companiesData as Entity[]),
  ...(mncsData as Entity[]),
  ...(regulatorsData as Entity[]),
  ...(academicData as Entity[]),
  ...(investorsData as Entity[]),
  ...(hospitalsData as Entity[]),
  ...(exchangesData as Entity[]),
];

const indexById = new Map(entities.map((e) => [e.id, e]));

export function getEntity(id: string): Entity | undefined {
  return indexById.get(id);
}

export function entitiesByCategory(category: EntityCategory): Entity[] {
  return entities.filter((e) => e.category === category);
}
