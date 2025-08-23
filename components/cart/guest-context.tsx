"use client";

import React, { createContext, useContext, useState } from "react";

interface GuestContextType {
  guestNames: string[];
  addGuest: (name: string) => void;
  removeGuest: (index: number) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [guestNames, setGuestNames] = useState<string[]>([]);

  const addGuest = (name: string) => {
    setGuestNames((prev) => [...prev, name]);
  };

  const removeGuest = (index: number) => {
    setGuestNames((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <GuestContext.Provider value={{ guestNames, addGuest, removeGuest }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuests() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error("useGuests must be used within a GuestProvider");
  }
  return context;
}
