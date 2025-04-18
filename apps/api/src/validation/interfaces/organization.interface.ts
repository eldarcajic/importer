export interface Organization {
  name: string;
  [key: `organization_attribute_${string}`]: string;
  error?: string;
}
