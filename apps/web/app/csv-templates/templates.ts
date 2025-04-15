export const csvTemplates = [
  {
    tableName: 'Attributes',
    columns: [
      {
        name: 'Identifier',
        key: 'identifier',
        required: true,
        description: 'Attribute of deal, contact, or organization',
        suggested_mappings: ['Identifier', 'Identify'],
      },
      {
        name: 'Title',
        key: 'title',
        required: true,
        description: 'Name of the provided attribute',
        suggested_mappings: ['Title', 'Name'],
      },
      {
        name: 'Attribute Type',
        key: 'attribute_type',
        required: true,
        description:
          'Type of the provided attribute. Can be text, money, date, number, textarea ',
        suggested_mappings: ['Type', 'Attribute Type', 'attribute_type'],
      },
    ],
  },
  {
    tableName: 'Contacts',
    columns: [
      {
        name: 'Organization Name',
        key: 'organization_name',
        required: true,
        description: 'Name of the organization the contact is associated with',
        suggested_mappings: [
          'Organization Name',
          'Company Name',
          'organization_name',
        ],
      },
      {
        name: 'Role',
        key: 'role',
        required: false,
        description: 'Role or position of the contact within the organization',
        suggested_mappings: ['Role', 'Position', 'Job Title'],
      },
      {
        name: 'Name',
        key: 'name',
        required: true,
        description: 'Full name of the contact',
        suggested_mappings: ['Name', 'Full Name', 'Contact Name'],
      },
      {
        name: 'Email',
        key: 'email',
        required: true,
        description: 'Email address of the contact',
        suggested_mappings: ['Email', 'Email Address'],
      },
      {
        name: 'Phone',
        key: 'phone',
        required: false,
        description: 'Phone number of the contact',
        suggested_mappings: ['Phone', 'Phone Number', 'Contact Number'],
      },
      ...Array.from({ length: 15 }, (_, i) => ({
        name: `Contact Attribute ${i + 1}`,
        key: `contact_attribute_${i + 1}`,
        required: false,
        description:
          'Custom attribute for the contact (e.g., text, number, date)',
        suggested_mappings: [
          `Contact Attribute ${i + 1}`,
          `contact_attribute_${i + 1}`,
        ],
      })),
    ],
  },
  {
    tableName: 'Deals',
    columns: [
      {
        name: 'Address',
        key: 'address',
        required: true,
        description: 'Physical or relevant address associated with the deal',
        suggested_mappings: ['Address', 'Location'],
      },
      {
        name: 'Nickname',
        key: 'nickname',
        required: false,
        description: 'Informal name or alias for the deal',
        suggested_mappings: ['Nickname', 'Deal Nickname'],
      },
      {
        name: 'Board Name',
        key: 'board_name',
        required: true,
        description: 'Name of the board or pipeline the deal belongs to',
        suggested_mappings: ['Board Name', 'Pipeline Name', 'board_name'],
      },
      {
        name: 'Stage Name',
        key: 'stage_name',
        required: true,
        description: 'Current stage of the deal within the board',
        suggested_mappings: ['Stage Name', 'Deal Stage', 'stage_name'],
      },
      ...Array.from({ length: 4 }, (_, i) => ({
        name: `Assignee ${i + 1}`,
        key: `assignee_${i + 1}`,
        required: false,
        description: `Person assigned to the deal (Assignee ${i + 1})`,
        suggested_mappings: [
          `Assignee ${i + 1}`,
          `Owner ${i + 1}`,
          `assignee_${i + 1}`,
        ],
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        name: `Editor ${i + 1}`,
        key: `editor_${i + 1}`,
        required: false,
        description: `Editor or contributor to the deal (Editor ${i + 1})`,
        suggested_mappings: [
          `Editor ${i + 1}`,
          `Contributor ${i + 1}`,
          `editor_${i + 1}`,
        ],
      })),
      ...Array.from({ length: 15 }, (_, i) => ({
        name: `Contact ${i + 1}`,
        key: `contact_${i + 1}`,
        required: false,
        description: `Contact associated with the deal (Contact ${i + 1})`,
        suggested_mappings: [
          `Contact ${i + 1}`,
          `Deal Contact ${i + 1}`,
          `contact_${i + 1}`,
        ],
      })),
      ...Array.from({ length: 15 }, (_, i) => ({
        name: `Deal Attribute ${i + 1}`,
        key: `deal_attribute_${i + 1}`,
        required: false,
        description: 'Custom attribute for the deal (e.g., text, money, date)',
        suggested_mappings: [
          `Deal Attribute ${i + 1}`,
          `Custom Field ${i + 1}`,
          `deal_attribute_${i + 1}`,
        ],
      })),
    ],
  },
  {
    tableName: 'Organizations',
    columns: [
      {
        name: 'Name',
        key: 'name',
        required: true,
        description: 'Name of the organization',
        suggested_mappings: ['Name', 'Organization Name', 'Company Name'],
      },
      ...Array.from({ length: 15 }, (_, i) => ({
        name: `Organization Attribute ${i + 1}`,
        key: `organization_attribute_${i + 1}`,
        required: false,
        description:
          'Custom attribute for the organization (e.g., text, number, date)',
        suggested_mappings: [
          `Organization Attribute ${i + 1}`,
          `Custom Field ${i + 1}`,
          `organization_attribute_${i + 1}`,
        ],
      })),
    ],
  },
  {
    tableName: 'Stages',
    columns: [
      {
        name: 'Board Name',
        key: 'board_name',
        required: true,
        description: 'Name of the board or pipeline the stage belongs to',
        suggested_mappings: ['Board Name', 'Pipeline Name', 'board_name'],
      },
      {
        name: 'Stage Name',
        key: 'stage_name',
        required: true,
        description: 'Name of the stage within the board',
        suggested_mappings: ['Stage Name', 'Phase Name', 'stage_name'],
      },
      {
        name: 'Order Index',
        key: 'order_index',
        required: true,
        description: 'Numerical order of the stage within the board',
        suggested_mappings: ['Order Index', 'Stage Order', 'order_index'],
      },
    ],
  },
];
