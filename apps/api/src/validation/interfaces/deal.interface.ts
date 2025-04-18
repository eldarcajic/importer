export interface Deal {
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
