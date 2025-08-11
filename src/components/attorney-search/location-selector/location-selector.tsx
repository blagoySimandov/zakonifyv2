"use client";

import { useLocationSelector } from "./hooks";
import { LOCATION_SELECTOR_CONSTANTS } from "./constants";
import { LOCATION_SELECTOR_MESSAGES } from "./messages";
import { Dropdown, type DropdownOption } from "@/components/ui";

export function LocationSelector() {
  const { selectedLocation, handleLocationChange } = useLocationSelector();

  const locationOptions: DropdownOption[] = LOCATION_SELECTOR_CONSTANTS.BULGARIAN_CITIES.map((city) => ({
    value: city,
    label: city,
  }));

  const handleDropdownChange = (value: string) => {
    handleLocationChange({ target: { value } } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <Dropdown
      options={locationOptions}
      value={selectedLocation}
      placeholder={LOCATION_SELECTOR_MESSAGES.PLACEHOLDER}
      onChange={handleDropdownChange}
    />
  );
}