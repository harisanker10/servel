"use client";
import { getUser } from "@/lib/auth/getUser";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const UserContext = createContext({});

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState();
  useEffect(() => {
    (async () => {
      setUser(await getUser());
    })();
  });
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}
