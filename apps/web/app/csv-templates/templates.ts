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
        suggested_mappings: ['Organization Name', 'Company Name'],
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
      {
        name: 'Contact Attribute 1',
        key: 'contact_attribute_1',
        required: false,
        description:
          'Custom attribute for the contact (e.g., text, number, date)',
        suggested_mappings: ['Contact Attribute 1', 'Custom Field 1'],
      },
      {
        name: 'Contact Attribute 2',
        key: 'contact_attribute_2',
        required: false,
        description:
          'Custom attribute for the contact (e.g., text, number, date)',
        suggested_mappings: ['Contact Attribute 2', 'Custom Field 2'],
      },
      {
        name: 'Contact Attribute 3',
        key: 'contact_attribute_3',
        required: false,
        description:
          'Custom attribute for the contact (e.g., text, number, date)',
        suggested_mappings: ['Contact Attribute 3', 'Custom Field 3'],
      },
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
        suggested_mappings: ['Board Name', 'Pipeline Name'],
      },
      {
        name: 'Stage Name',
        key: 'stage_name',
        required: true,
        description: 'Current stage of the deal within the board',
        suggested_mappings: ['Stage Name', 'Deal Stage'],
      },
      {
        name: 'Assignee 1',
        key: 'assignee_1',
        required: false,
        description: 'Primary person assigned to the deal',
        suggested_mappings: ['Assignee 1', 'Owner 1'],
      },
      {
        name: 'Assignee 2',
        key: 'assignee_2',
        required: false,
        description: 'Secondary person assigned to the deal',
        suggested_mappings: ['Assignee 2', 'Owner 2'],
      },
      {
        name: 'Editor 1',
        key: 'editor_1',
        required: false,
        description: 'Primary editor or contributor to the deal',
        suggested_mappings: ['Editor 1', 'Contributor 1'],
      },
      {
        name: 'Editor 2',
        key: 'editor_2',
        required: false,
        description: 'Secondary editor or contributor to the deal',
        suggested_mappings: ['Editor 2', 'Contributor 2'],
      },
      {
        name: 'Contact 1',
        key: 'contact_1',
        required: false,
        description: 'Primary contact associated with the deal',
        suggested_mappings: ['Contact 1', 'Primary Contact'],
      },
      {
        name: 'Contact 2',
        key: 'contact_2',
        required: false,
        description: 'Secondary contact associated with the deal',
        suggested_mappings: ['Contact 2', 'Secondary Contact'],
      },
      {
        name: 'Deal Attribute 1',
        key: 'deal_attribute_1',
        required: false,
        description: 'Custom attribute for the deal (e.g., text, money, date)',
        suggested_mappings: ['Deal Attribute 1', 'Custom Field 1'],
      },
      {
        name: 'Deal Attribute 2',
        key: 'deal_attribute_2',
        required: false,
        description: 'Custom attribute for the deal (e.g., text, money, date)',
        suggested_mappings: ['Deal Attribute 2', 'Custom Field 2'],
      },
      {
        name: 'Deal Attribute 3',
        key: 'deal_attribute_3',
        required: false,
        description: 'Custom attribute for the deal (e.g., text, money, date)',
        suggested_mappings: ['Deal Attribute 3', 'Custom Field 3'],
      },
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
      {
        name: 'Organization Attribute 1',
        key: 'organization_attribute_1',
        required: false,
        description:
          'Custom attribute for the organization (e.g., text, number, date)',
        suggested_mappings: ['Organization Attribute 1', 'Custom Field 1'],
      },
      {
        name: 'Organization Attribute 2',
        key: 'organization_attribute_2',
        required: false,
        description:
          'Custom attribute for the organization (e.g., text, number, date)',
        suggested_mappings: ['Organization Attribute 2', 'Custom Field 2'],
      },
      {
        name: 'Organization Attribute 3',
        key: 'organization_attribute_3',
        required: false,
        description:
          'Custom attribute for the organization (e.g., text, number, date)',
        suggested_mappings: ['Organization Attribute 3', 'Custom Field 3'],
      },
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
        suggested_mappings: ['Board Name', 'Pipeline Name'],
      },
      {
        name: 'Stage Name',
        key: 'stage_name',
        required: true,
        description: 'Name of the stage within the board',
        suggested_mappings: ['Stage Name', 'Phase Name'],
      },
      {
        name: 'Order Index',
        key: 'order_index',
        required: true,
        description: 'Numerical order of the stage within the board',
        suggested_mappings: ['Order Index', 'Stage Order'],
      },
    ],
  },
];
