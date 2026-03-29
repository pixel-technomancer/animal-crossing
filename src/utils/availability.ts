import type { Creature, Hemisphere } from '../types/common';

export function isAvailableNow(creature: Creature, hemisphere: Hemisphere): boolean {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentHour = now.getHours();

  const monthArray = hemisphere === 'northern'
    ? creature.availability['month-array-northern']
    : creature.availability['month-array-southern'];

  const monthAvailable = creature.availability.isAllYear || monthArray.includes(currentMonth);
  const timeAvailable = creature.availability.isAllDay || creature.availability['time-array'].includes(currentHour);

  return monthAvailable && timeAvailable;
}

export function isAvailableThisMonth(creature: Creature, hemisphere: Hemisphere): boolean {
  const currentMonth = new Date().getMonth() + 1;
  const monthArray = hemisphere === 'northern'
    ? creature.availability['month-array-northern']
    : creature.availability['month-array-southern'];
  return creature.availability.isAllYear || monthArray.includes(currentMonth);
}

export function isLeavingThisMonth(creature: Creature, hemisphere: Hemisphere): boolean {
  if (creature.availability.isAllYear) return false;
  const currentMonth = new Date().getMonth() + 1;
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const monthArray = hemisphere === 'northern'
    ? creature.availability['month-array-northern']
    : creature.availability['month-array-southern'];
  return monthArray.includes(currentMonth) && !monthArray.includes(nextMonth);
}

export function isNewThisMonth(creature: Creature, hemisphere: Hemisphere): boolean {
  if (creature.availability.isAllYear) return false;
  const currentMonth = new Date().getMonth() + 1;
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const monthArray = hemisphere === 'northern'
    ? creature.availability['month-array-northern']
    : creature.availability['month-array-southern'];
  return monthArray.includes(currentMonth) && !monthArray.includes(prevMonth);
}

export function getAvailabilityMonths(creature: Creature, hemisphere: Hemisphere): number[] {
  if (creature.availability.isAllYear) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return hemisphere === 'northern'
    ? creature.availability['month-array-northern']
    : creature.availability['month-array-southern'];
}

export function getAvailabilityHours(creature: Creature): number[] {
  if (creature.availability.isAllDay) return Array.from({ length: 24 }, (_, i) => i);
  return creature.availability['time-array'];
}

export function formatTimeRange(creature: Creature): string {
  if (creature.availability.isAllDay) return 'All day';
  return creature.availability.time || 'All day';
}

export function formatMonthRange(creature: Creature, hemisphere: Hemisphere): string {
  if (creature.availability.isAllYear) return 'All year';
  return hemisphere === 'northern'
    ? creature.availability['month-northern']
    : creature.availability['month-southern'];
}
