export type Channel = {
  id: string;
  name: string;
  views: number;
  revenue: number;
  watchTimeHours: number;
  durationHours: number;
  clicks: number;
  impressions: number;
};

export type AggregatedMetrics = {
  rpm: number;
  retention: number;
  conversion: number;
  totalRevenue: number;
};

export function mockChannels(): Channel[] {
  return [
    { id: "yt", name: "YouTube", views: 1_200_000, revenue: 2400, watchTimeHours: 8000, durationHours: 12000, clicks: 1200, impressions: 50000 },
    { id: "tt", name: "TikTok", views: 3_400_000, revenue: 1800, watchTimeHours: 2000, durationHours: 2500, clicks: 3400, impressions: 120000 },
  ];
}

export function rpm(revenue: number, views: number): number {
  if (views === 0) return 0;
  return (revenue / views) * 1000;
}

export function retention(watchTime: number, duration: number): number {
  if (duration === 0) return 0;
  return watchTime / duration;
}

export function conversion(clicks: number, impressions: number): number {
  if (impressions === 0) return 0;
  return clicks / impressions;
}

export function computeMetrics(channels: Channel[]): AggregatedMetrics {
  const views = channels.reduce((s, c) => s + c.views, 0);
  const revenue = channels.reduce((s, c) => s + c.revenue, 0);
  const watch = channels.reduce((s, c) => s + c.watchTimeHours, 0);
  const dur = channels.reduce((s, c) => s + c.durationHours, 0);
  const clicks = channels.reduce((s, c) => s + c.clicks, 0);
  const imp = channels.reduce((s, c) => s + c.impressions, 0);
  return {
    rpm: rpm(revenue, views),
    retention: retention(watch, dur),
    conversion: conversion(clicks, imp),
    totalRevenue: revenue,
  };
}
