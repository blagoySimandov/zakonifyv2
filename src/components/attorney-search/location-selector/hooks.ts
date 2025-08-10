import { useState } from "react";

export function useLocationSelector() {
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(event.target.value);
  };

  return {
    selectedLocation,
    handleLocationChange,
  };
}