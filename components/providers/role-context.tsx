"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "farmer" | "agronomist" | "admin";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userId: string | null;
  fullName: string;
  avatarUrl: string | null;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ 
  children,
  initialRole = "farmer",
  userId = null,
  initialFullName = "User",
  initialAvatarUrl = null
}: { 
  children: React.ReactNode;
  initialRole?: UserRole;
  userId?: string | null;
  initialFullName?: string;
  initialAvatarUrl?: string | null;
}) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState<string>(initialFullName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);

  useEffect(() => {
    setRole(initialRole);
    setFullName(initialFullName);
    setAvatarUrl(initialAvatarUrl);
  }, [initialRole, initialFullName, initialAvatarUrl]);

  return (
    <RoleContext.Provider value={{ role, setRole, userId, fullName, avatarUrl }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
