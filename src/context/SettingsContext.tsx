export type UnitSystem = 'metric' | 'imperial';

export interface SettingsContextType {
  showFlags: boolean;
  toggleFlags: () => void;
  unitSystem: UnitSystem;
  toggleUnitSystem: () => void;
  convertTemp: (celsius: number) => number;
  convertWindSpeed: (mps: number) => number;
  getTempUnit: () => string;
  getWindSpeedUnit: () => string;
}

