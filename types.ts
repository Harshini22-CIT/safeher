
export enum SafetyStatus {
  SAFE = 'SAFE',
  AT_RISK = 'AT_RISK',
  ALERT = 'ALERT'
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  relation: string;
  isLive: boolean;
  status: 'pending' | 'verified';
  avatarSeed: string;
  lastLocation?: {
    lat: number;
    lng: number;
    timestamp: number;
  };
}

export interface SafetyTip {
  id: string;
  category: string;
  content: string;
}

export interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
  speed?: number | null;
  heading?: number | null;
  timestamp: number;
}
