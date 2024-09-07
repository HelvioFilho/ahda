import { create } from "zustand";

export type SettingsProps = {
  name: string;
  email: string;
  notification: boolean;
};

type ZustandProps = {
  startSettings: SettingsProps;
  setStartSettings: (startSettings: SettingsProps) => void;
};

export const appDataStore = create<ZustandProps>((set) => ({
  startSettings: {} as SettingsProps,
  setStartSettings: (startSettings) => set({ startSettings }),
}));
