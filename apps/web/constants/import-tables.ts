import { Table } from '@/types';

export const importTables: Table[] = [
  {
    id: 1,
    name: 'Attributes',
    label: 'Attributes',
    templateName: 'attributes',
    uploaded: false,
    tableType: 'Attribute',
  },
  {
    id: 2,
    name: 'Contacts',
    label: 'Contacts',
    templateName: 'contacts',
    uploaded: false,
    tableType: 'Contact',
  },
  {
    id: 3,
    name: 'Deals',
    label: 'Deals',
    templateName: 'deals',
    uploaded: false,
    tableType: 'Deal',
  },
  {
    id: 4,
    name: 'Organizations',
    label: 'Organizations',
    templateName: 'organizations',
    uploaded: false,
    tableType: 'Organization',
  },
  {
    id: 5,
    name: 'Stages',
    label: 'Stages',
    templateName: 'stages',
    uploaded: false,
    tableType: 'Stage',
  },
];
