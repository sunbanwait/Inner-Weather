// src/moodConfig.js
import { Sun, CloudSun, Cloud, CloudRain, CloudLightning } from 'lucide-react';

export const MOODS = [
  { 
    label: "Sunny", 
    value: 5, 
    icon: Sun, 
    color: "#FEF9C3", // Pastel Yellow
    highlight: "#FDE047", // Slightly darker yellow for buttons
    message: "Radiating sunshine!" 
  },
  { 
    label: "Partly Cloudy", 
    value: 4, 
    icon: CloudSun, 
    color: "#ECFCCB", // Pastel Lime/Mint
    highlight: "#BEF264",
    message: "Fresh and breezy." 
  },
  { 
    label: "Cloudy", 
    value: 3, 
    icon: Cloud, 
    color: "#E0E7FF", // PERIWINKLE (Soft Blue-Purple)
    highlight: "#A5B4FC",
    message: "Cozy and calm." 
  },
  { 
    label: "Rainy", 
    value: 2, 
    icon: CloudRain, 
    color: "#DBEAFE", // Pastel Baby Blue
    highlight: "#93C5FD",
    message: "A little blue today." 
  },
  { 
    label: "Stormy", 
    value: 1, 
    icon: CloudLightning, 
    color: "#F3E8FF", // Pastel Lavender/Purple
    highlight: "#D8B4FE",
    message: "Rough weather inside." 
  }
];