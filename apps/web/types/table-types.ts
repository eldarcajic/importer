interface Attribute {
  identifier: string;
  title: string;
  type: string;
  error?: string;
}

interface Contact {
  organization_name: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  [key: `contact_attribute_${string}`]: string;
  error?: string;
}

interface Deal {
  address: string;
  nickname: string;
  board_name: string;
  stage_name: string;
  [key: `assignee_${string}`]: string;
  [key: `editor_${string}`]: string;
  [key: `contact_${string}`]: string;
  [key: `deal_attribute_${string}`]: string;
  error?: string;
}

interface Organization {
  name: string;
  [key: `organization_attribute_${string}`]: string;
  error?: string;
}

interface Stage {
  board_name: string;
  stage_name: string;
  order_index: string;
  error?: string;
}

interface TableData<T> {
  tableName: string;
  data: T[];
}

type JsonData = TableData<Attribute | Contact | Deal | Organization | Stage>[];
