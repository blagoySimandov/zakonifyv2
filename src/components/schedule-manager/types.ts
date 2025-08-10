import { TABS } from "./constants";

export type TabId = (typeof TABS)[number]["id"];
export type Tab = (typeof TABS)[number];
