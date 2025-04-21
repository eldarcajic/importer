import { Injectable } from '@nestjs/common';
import {
  JsonDataDto,
  AttributeDto,
  ContactDto,
  DealDto,
  OrganizationDto,
  StageDto,
} from './dto';

@Injectable()
export class ValidationService {
  private readonly config = {
    validAttributeTypes: ['text', 'number', 'date', 'money', 'textarea'],
    teamUsers: ['Alice Brown', 'Bob Wilson', 'Charlie Davis'],
    kanbanBoards: ['Sales Pipeline', 'Project Management', 'Customer Success'],
    regexPatterns: {
      email: /^[^@]+@[^@]+\.[^@]+$/,
      phone: /^\d[\d-]{5,}$/,
      date: /^\d{4}-\d{2}-\d{2}$/,
    }, // Maybe use standard library for validation, e.g. phone - https://www.npmjs.com/package/phone
    attributePrefixes: {
      Contact: 'contact_attribute_',
      Deal: 'deal_attribute_',
      Organization: 'organization_attribute_',
    },
  };

  validateJsonData(jsonData: JsonDataDto): any {
    /*********
     * Initialize storage for tables and attribute usage tracking.
     * tablesByName maps table names to their data for easy access.
     * attributeUsage tracks which attributes are used to determine which to remove.
     * Trim all string values to prevent mismatches due to leading/trailing spaces.
     *********/
    const tablesByName: Record<string, any> = {};
    const attributeUsage: Map<string, boolean> = new Map();

    jsonData.tables.forEach((table) => {
      tablesByName[table.tableName] = {
        ...table,
        data: table.data.map((record: any) => this.trimRecordStrings(record)),
      };
      if (table.tableName === 'Attribute') {
        (tablesByName[table.tableName].data as AttributeDto[]).forEach(
          (attr: AttributeDto) => {
            attributeUsage.set(attr.identifier, false);
          },
        );
      }
    });

    /*********
     * Mark attributes as used if they appear with non-empty values in Contact, Deal, or Organization.
     * This identifies which attributes are needed and which can be removed if undefined.
     *********/
    ['Contact', 'Deal', 'Organization'].forEach((tableName) => {
      const table = tablesByName[tableName];
      if (!table) return;
      const prefix = this.config.attributePrefixes[tableName];
      table.data.forEach((record: any) => {
        Object.keys(record).forEach((key) => {
          if (key.startsWith(prefix) && record[key]) {
            attributeUsage.set(key, true);
          }
        });
      });
    });

    /*********
     * Identify attributes to remove: those with no title, no type, and not used.
     * These are considered empty and irrelevant, so they are marked for removal.
     *********/
    const attributesToRemove = new Set<string>();
    if (tablesByName['Attribute']) {
      (tablesByName['Attribute'].data as AttributeDto[]).forEach(
        (attr: AttributeDto) => {
          if (
            !attr.title &&
            !attr.attribute_type &&
            !attributeUsage.get(attr.identifier)
          ) {
            attributesToRemove.add(attr.identifier);
          }
        },
      );
    }

    /*********
     * Create lookup maps for validation:
     * - organizations: Set of organization names for Contact validation.
     * - contacts: Set of contact names for Deal validation.
     * - deals: Set of deal nicknames to ensure uniqueness.
     * - stages: Map of board names to stage names for Deal validation.
     * - attributes: Map of attribute identifiers to their title and type.
     *********/
    const organizations = new Set<string>();
    const contacts = new Set<string>();
    const deals = new Set<string>();
    const stages = new Map<string, Set<string>>();
    const attributes = new Map<
      string,
      { title: string; attribute_type: string }
    >();

    /*********
     * Validate and process each table, removing unused attribute columns and adding errors.
     * Each record is validated according to table-specific rules, with errors collected.
     *********/
    const validatedData = Object.values(tablesByName).map((table) => {
      if (table.tableName === 'Attribute') {
        /*********
         * Filter out attributes marked for removal and validate the remaining ones.
         * Check for unique titles and identifiers, valid attribute types, and presence of title and type.
         *********/
        const titleCounts = new Map<string, number>();
        const identifierCounts = new Map<string, number>();
        table.data.forEach((attr: AttributeDto) => {
          if (attr.title) {
            titleCounts.set(attr.title, (titleCounts.get(attr.title) || 0) + 1);
          }
          if (attr.identifier) {
            identifierCounts.set(
              attr.identifier,
              (identifierCounts.get(attr.identifier) || 0) + 1,
            );
          }
        });

        const filteredData = (table.data as AttributeDto[])
          .filter((attr) => !attributesToRemove.has(attr.identifier))
          .map((attr: AttributeDto) => {
            const errors: string[] = [];

            /*********
             * Validate that both title and type are present.
             * Missing title or type indicates an incomplete attribute, which is invalid.
             *********/
            if (!attr.title) {
              errors.push('Missing title');
            }
            if (!attr.attribute_type) {
              errors.push('Missing attribute_type');
            }

            /*********
             * Ensure attribute_type is one of the allowed types if present.
             * Invalid types could cause issues in attribute validation in other tables.
             *********/
            if (
              attr.attribute_type &&
              !this.config.validAttributeTypes.includes(attr.attribute_type)
            ) {
              errors.push(
                `Invalid attribute_type '${attr.attribute_type}', must be one of ${this.config.validAttributeTypes.join(', ')}`,
              );
            }

            /*********
             * Check for duplicate titles, as titles must be unique.
             * Duplicate titles could lead to confusion in attribute identification.
             *********/
            if (attr.title && titleCounts.get(attr.title)! > 1) {
              errors.push('Duplicate title');
            }

            /*********
             * Check for duplicate identifiers, as identifiers must be unique.
             * Duplicate identifiers could cause incorrect attribute mappings.
             *********/
            if (attr.identifier && identifierCounts.get(attr.identifier)! > 1) {
              errors.push('Duplicate identifier');
            }

            /*********
             * Store attribute details in the attributes map for use in other tables.
             * This map validates attribute values in Contact, Deal, and Organization.
             *********/
            attributes.set(attr.identifier, {
              title: attr.title,
              attribute_type: attr.attribute_type,
            });

            return errors.length > 0
              ? { ...attr, error: errors.join('; ') }
              : attr;
          });

        return { ...table, data: filteredData };
      }

      /*********
       * Process non-Attribute tables, validating records and removing unused attributes.
       * Each table has specific validation rules based on its fields and relationships.
       *********/
      const validatedRecords = table.data.map((record: any) => {
        const errors: string[] = [];
        const newRecord: Record<string, any> = { ...record };

        /*********
         * Remove attribute columns marked for removal (unused and undefined).
         * This cleans the data by eliminating irrelevant columns.
         *********/
        Object.keys(newRecord).forEach((key) => {
          if (attributesToRemove.has(key)) {
            delete newRecord[key];
          }
        });

        if (table.tableName === 'Contact') {
          const contact = newRecord as ContactDto;

          /*********
           * Validate required fields: name, email, phone, organization_name.
           * These fields are essential for a valid contact record.
           *********/
          ['name', 'email', 'phone', 'organization_name'].forEach((field) => {
            if (!contact[field]) {
              errors.push(`Missing required field: ${field}`);
            }
          });

          /*********
           * Validate email format using a regex for standard email patterns.
           * This prevents invalid email addresses from being processed.
           *********/
          if (
            contact.email &&
            !this.config.regexPatterns.email.test(contact.email)
          ) {
            errors.push('Invalid email format');
          }

          /*********
           * Validate phone format to ensure at least 6 digits, allowing hyphens.
           * This ensures phone numbers are usable for communication.
           *********/
          if (
            contact.phone &&
            !this.config.regexPatterns.phone.test(contact.phone)
          ) {
            errors.push('Invalid phone format');
          }

          /*********
           * Validate custom attributes to ensure they are defined in Attribute table.
           * Check for presence of title and type, and validate values if both are present.
           *********/
          Object.keys(contact).forEach((key) => {
            if (key.startsWith(this.config.attributePrefixes.Contact)) {
              const attr = attributes.get(key);
              if (contact[key]) {
                if (!attr) {
                  errors.push(`${key} used but not defined in Attribute table`);
                } else {
                  if (!attr.title || !attr.attribute_type) {
                    errors.push(
                      `Invalid attribute: ${key}. Check Attributes table.`,
                    );
                  }
                  if (attr.title && attr.attribute_type) {
                    this.validateAttributeValue(
                      contact[key],
                      attr.attribute_type,
                      key,
                      errors,
                    );
                  }
                }
              }
            }
          });

          /*********
           * Check for unique contact names to prevent duplicates.
           * Duplicate names could cause confusion in referencing contacts.
           *********/
          if (contact.name) {
            if (contacts.has(contact.name)) {
              errors.push('Duplicate contact name');
            } else {
              contacts.add(contact.name);
            }
          }
        }

        if (table.tableName === 'Organization') {
          const org = newRecord as OrganizationDto;

          /*********
           * Validate required field: name.
           * The name is essential for identifying organizations.
           *********/
          if (!org.name) {
            errors.push('Missing required field: name');
          }

          /*********
           * Validate custom attributes to ensure they are defined.
           * Check for presence of title and type, and validate values if both are present.
           *********/
          Object.keys(org).forEach((key) => {
            if (key.startsWith(this.config.attributePrefixes.Organization)) {
              const attr = attributes.get(key);
              if (org[key]) {
                if (!attr) {
                  errors.push(`${key} used but not defined in Attribute table`);
                } else {
                  if (!attr.title) {
                    errors.push(`${key} has no title`);
                  }
                  if (!attr.attribute_type) {
                    errors.push(`${key} has no type`);
                  }
                  if (attr.title && attr.attribute_type) {
                    this.validateAttributeValue(
                      org[key],
                      attr.attribute_type,
                      key,
                      errors,
                    );
                  }
                }
              }
            }
          });

          /*********
           * Check for unique organization names to prevent duplicates.
           * Duplicate names could lead to incorrect references in Contact.
           *********/
          if (org.name) {
            if (organizations.has(org.name)) {
              errors.push('Duplicate organization name');
            } else {
              organizations.add(org.name);
            }
          }
        }

        if (table.tableName === 'Deal') {
          const deal = newRecord as DealDto;

          /*********
           * Validate required fields: address, nickname, board_name, stage_name.
           * These fields are critical for defining a deal.
           *********/
          ['address', 'nickname', 'board_name', 'stage_name'].forEach(
            (field) => {
              if (!deal[field]) {
                errors.push(`Missing required field: ${field}`);
              }
            },
          );

          /*********
           * Validate assignees and editors to ensure they are in teamUsers.
           * This ensures only authorized users are assigned to deals.
           *********/
          Object.keys(deal).forEach((key) => {
            if (
              (key.startsWith('assignee_') || key.startsWith('editor_')) &&
              deal[key]
            ) {
              if (!this.config.teamUsers.includes(deal[key])) {
                errors.push(
                  `${key} (${deal[key]}) not in team user list [${this.config.teamUsers.join(', ')}]`,
                );
              }
            }
          });

          /*********
           * Validate contact references to ensure they exist in Contact table.
           * This ensures deals reference valid contacts.
           *********/
          Object.keys(deal).forEach((key) => {
            if (key.match(/^contact_\d+$/) && deal[key]) {
              if (!contacts.has(deal[key])) {
                errors.push(
                  `${key} (${deal[key]}) does not match any contact name`,
                );
              }
            }
          });

          /*********
           * Validate custom attributes to ensure they are defined.
           * Check for presence of title and type, and validate values if both are present.
           *********/
          Object.keys(deal).forEach((key) => {
            if (key.startsWith(this.config.attributePrefixes.Deal)) {
              const attr = attributes.get(key);
              if (deal[key]) {
                if (!attr) {
                  errors.push(`${key} used but not defined in Attribute table`);
                } else {
                  if (!attr.title) {
                    errors.push(`${key} has no title`);
                  }
                  if (!attr.attribute_type) {
                    errors.push(`${key} has no type`);
                  }
                  if (attr.title && attr.attribute_type) {
                    this.validateAttributeValue(
                      deal[key],
                      attr.attribute_type,
                      key,
                      errors,
                    );
                  }
                }
              }
            }
          });

          /*********
           * Check for unique deal nicknames to prevent duplicates.
           * Duplicate nicknames could cause confusion in deal identification.
           *********/
          if (deal.nickname) {
            if (deals.has(deal.nickname)) {
              errors.push('Duplicate deal nickname');
            } else {
              deals.add(deal.nickname);
            }
          }
        }

        if (table.tableName === 'Stage') {
          const stage = newRecord as StageDto;

          /*********
           * Validate required fields: board_name, stage_name, order_index.
           * These fields define the structure of kanban boards.
           *********/
          ['board_name', 'stage_name', 'order_index'].forEach((field) => {
            if (!stage[field]) {
              errors.push(`Missing required field: ${field}`);
            }
          });

          /*********
           * Validate order_index to ensure it's a non-negative integer.
           * This ensures stages can be properly ordered in the kanban board.
           *********/
          if (
            stage.order_index &&
            (isNaN(parseInt(stage.order_index)) ||
              parseInt(stage.order_index) < 0)
          ) {
            errors.push('Invalid order_index: must be a non-negative integer');
          }

          /*********
           * Validate board_name and ensure stage names are unique per board.
           * Only add valid board names to the stages map to ensure Deals reference valid boards.
           * Log the board_name for debugging to trace validation errors.
           *********/
          if (stage.board_name && stage.stage_name) {
            console.log(
              `Validating Stage board_name: ${stage.board_name}, stage_name: ${stage.stage_name}`,
            );
            if (!this.config.kanbanBoards.includes(stage.board_name)) {
              errors.push(
                `Invalid board_name '${stage.board_name}', must be one of ${this.config.kanbanBoards.join(', ')}`,
              );
            } else {
              if (!stages.has(stage.board_name)) {
                stages.set(stage.board_name, new Set());
              }
              if (stages.get(stage.board_name)!.has(stage.stage_name)) {
                errors.push('Duplicate stage name for board');
              } else {
                stages.get(stage.board_name)!.add(stage.stage_name);
              }
            }
          }
        }

        return errors.length > 0
          ? { ...newRecord, error: errors.join('; ') }
          : newRecord;
      });

      return { ...table, data: validatedRecords };
    });

    /*********
     * Perform cross-table validations:
     * - Contact: Ensure organization_name exists in Organization table.
     * - Deal: Ensure board_name and stage_name exist in Stage table.
     * These checks ensure referential integrity across tables.
     *********/
    validatedData.forEach((table) => {
      if (table.tableName === 'Contact') {
        (table.data as ContactDto[]).forEach((record) => {
          if (
            record.organization_name &&
            !organizations.has(record.organization_name)
          ) {
            const errors = record.error ? record.error.split('; ') : [];
            errors.push(
              `organization_name (${record.organization_name}) does not match any organization name`,
            );
            record.error = errors.join('; ');
          }
        });
      }

      if (table.tableName === 'Deal') {
        (table.data as DealDto[]).forEach((record) => {
          const errors = record.error ? record.error.split('; ') : [];
          if (record.board_name && record.stage_name) {
            if (!this.config.kanbanBoards.includes(record.board_name)) {
              errors.push(
                `board_name '${record.board_name}' is not a valid board`,
              );
            } else if (!stages.has(record.board_name)) {
              errors.push(`No stages defined for board '${record.board_name}'`);
            } else if (!stages.get(record.board_name)!.has(record.stage_name)) {
              errors.push(
                `stage_name '${record.stage_name}' does not exist for board '${record.board_name}'`,
              );
            }
          }
          if (errors.length > 0) {
            record.error = errors.join('; ');
          }
        });
      }
    });

    return { tables: validatedData };
  }

  /*********
   * Helper function to trim all string values in a record.
   * This prevents mismatches due to leading/trailing spaces in identifiers or fields.
   *********/
  private trimRecordStrings(record: any): any {
    const trimmedRecord: Record<string, any> = {};
    Object.keys(record).forEach((key) => {
      trimmedRecord[key] =
        typeof record[key] === 'string' ? record[key].trim() : record[key];
    });
    return trimmedRecord;
  }

  /*********
   * Helper function to validate attribute values based on their type.
   * Ensures that values conform to the expected format (e.g., number, date).
   *********/
  private validateAttributeValue(
    value: string,
    attribute_type: string,
    field: string,
    errors: string[],
  ) {
    if (attribute_type === 'number' || attribute_type === 'money') {
      /*********
       * For number and money types, ensure the value can be parsed as a number.
       * This prevents non-numeric values from being stored.
       *********/
      if (isNaN(parseFloat(value))) {
        errors.push(`${field} should be a number, found string '${value}'`);
      }
    } else if (attribute_type === 'date') {
      /*********
       * For date type, ensure the value matches YYYY-MM-DD and is a valid date.
       * This ensures dates are usable for sorting and display.
       *********/
      if (
        !this.config.regexPatterns.date.test(value) ||
        isNaN(Date.parse(value))
      ) {
        errors.push(
          `${field} should be a valid date (YYYY-MM-DD), found '${value}'`,
        );
      }
    }
    /*********
     * For text and textarea types, no specific validation is required.
     * This allows flexibility for free-form text inputs.
     *********/
  }
}
