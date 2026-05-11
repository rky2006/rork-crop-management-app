import * as Crypto from 'expo-crypto';

export function generateId(): string {
  return Crypto.randomUUID();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function daysFromNow(dateString: string): number {
  const now = new Date();
  const target = new Date(dateString);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getProgressPercent(sowingDate: string, harvestDate: string): number {
  const now = new Date().getTime();
  const sow = new Date(sowingDate).getTime();
  const harvest = new Date(harvestDate).getTime();
  if (now >= harvest) return 100;
  if (now <= sow) return 0;
  return Math.round(((now - sow) / (harvest - sow)) * 100);
}

import { GrowthStage, GROWTH_STAGES } from '@/types/crop';

const STAGE_PERCENT_RANGES: { stage: GrowthStage; start: number; end: number }[] = [
  { stage: 'sowing', start: 0, end: 5 },
  { stage: 'germination', start: 5, end: 15 },
  { stage: 'vegetative', start: 15, end: 40 },
  { stage: 'flowering', start: 40, end: 55 },
  { stage: 'fruiting', start: 55, end: 75 },
  { stage: 'ripening', start: 75, end: 90 },
  { stage: 'harvest', start: 90, end: 100 },
];

export function calculateAutoStage(sowingDate: string, harvestDate: string): GrowthStage {
  const now = new Date().getTime();
  const sow = new Date(sowingDate).getTime();
  const harvest = new Date(harvestDate).getTime();

  if (now < sow) return 'planning';
  if (now >= harvest) return 'completed';

  const progress = ((now - sow) / (harvest - sow)) * 100;

  for (const range of STAGE_PERCENT_RANGES) {
    if (progress >= range.start && progress < range.end) {
      return range.stage;
    }
  }

  return 'harvest';
}

export function getExpectedStageDate(sowingDate: string, harvestDate: string, stage: GrowthStage): string {
  const sow = new Date(sowingDate).getTime();
  const harvest = new Date(harvestDate).getTime();
  const totalDuration = harvest - sow;

  const range = STAGE_PERCENT_RANGES.find(r => r.stage === stage);
  if (!range) return sowingDate;

  const stageStart = sow + (totalDuration * range.start / 100);
  return new Date(stageStart).toISOString();
}

export function getDaysInStage(sowingDate: string, harvestDate: string, stage: GrowthStage): number {
  const sow = new Date(sowingDate).getTime();
  const harvest = new Date(harvestDate).getTime();
  const totalDuration = harvest - sow;

  const range = STAGE_PERCENT_RANGES.find(r => r.stage === stage);
  if (!range) return 0;

  const durationMs = totalDuration * (range.end - range.start) / 100;
  return Math.round(durationMs / (1000 * 60 * 60 * 24));
}
