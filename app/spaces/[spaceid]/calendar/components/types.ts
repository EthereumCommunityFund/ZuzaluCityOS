// Calendar-specific types
export interface ItemType {
  id: string;
  name: string;
  description: string;
  expandedContent?: React.ReactNode;
}

export enum RegistrationAccess {
  OpenToAll = 'open-to-all',
  Whitelist = 'whitelist',
}
