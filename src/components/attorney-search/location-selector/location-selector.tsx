"use client";

import { useLocationSelector } from "./hooks";
import { LOCATION_SELECTOR_CONSTANTS } from "./constants";
import { LOCATION_SELECTOR_MESSAGES } from "./messages";

export function LocationSelector() {
  const { selectedLocation, handleLocationChange } = useLocationSelector();

  return (
    <select 
      className={LOCATION_SELECTOR_CONSTANTS.SELECT_CLASSES}
      value={selectedLocation}
      onChange={handleLocationChange}
    >
      <option value="">
        {LOCATION_SELECTOR_MESSAGES.PLACEHOLDER}
      </option>
      {LOCATION_SELECTOR_CONSTANTS.BULGARIAN_CITIES.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
}