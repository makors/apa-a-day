import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const countries = [
  'American',
  'British',
  'Canadian',
  'Australian',
  'New Zealand',
  'South African',
  'Indian',
  'Pakistani',
];