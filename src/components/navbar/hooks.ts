import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useNavbarState() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAttorney = useQuery(api.attorneys.isCurrentUserAttorney);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((previousState) => !previousState);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    isAttorney,
  };
}
