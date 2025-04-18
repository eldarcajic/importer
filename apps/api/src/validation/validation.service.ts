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
  private readonly TEAM_USERS = ['Alice Brown', 'Bob Wilson', 'Charlie Davis'];
  private readonly VALID_ATTRIBUTE_TYPES = [
    'text',
    'money',
    'date',
    'number',
    'textarea',
  ];
  private readonly EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;
  private readonly PHONE_REGEX = /^\d[\d-]{5,}$/;
  private readonly URL_REGEX = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}$/i;
  private readonly DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

  validateJsonData(jsonData: JsonDataDto): any {
    const data = jsonData.tables;

    // Step 1: Identify columns to remove (empty across all tables)
    const attributeUsage: Record<string, boolean> = {};
    const tablesByName: Record<string, any> = {};

    data.forEach((table) => {
      tablesByName[table.tableName] = table;
      if (table.tableName === 'Attribute') {
        (table.data as AttributeDto[]).forEach((attr: AttributeDto) => {
          attributeUsage[attr.identifier] = false;
        });
      }
    });

    ['Contact', 'Deal', 'Organization'].forEach((tableName) => {
      const table = tablesByName[tableName];
      if (!table) return;

      table.data.forEach((record: ContactDto | DealDto | OrganizationDto) => {
        Object.keys(record).forEach((key) => {
          if (
            key.startsWith('contact_attribute_') ||
            key.startsWith('deal_attribute_') ||
            key.startsWith('organization_attribute_') ||
            key.match(/^contact_\d+$/)
          ) {
            if (record[key]) {
              const identifier = key.match(/^contact_(\d+)$/)
                ? `deal_attribute_${parseInt(key.split('_')[1]) - 10}`
                : key;
              attributeUsage[identifier] = true;
            }
          }
        });
      });
    });

    const attributesToRemove = new Set<string>();
    (tablesByName['Attribute']?.data || []).forEach((attr: AttributeDto) => {
      if (
        !attr.title &&
        !attr.attribute_type &&
        !attributeUsage[attr.identifier]
      ) {
        attributesToRemove.add(attr.identifier);
      }
    });

    // Step 2: Remove unused attributes
    const cleanedData = data.map((table) => {
      if (table.tableName === 'Attribute') {
        const filteredData = (table.data as AttributeDto[]).filter(
          (attr) => !attributesToRemove.has(attr.identifier),
        );
        return { ...table, data: filteredData };
      }
      return table;
    });

    // Step 3: Create lookup maps
    const organizations = new Set<string>();
    const contacts = new Set<string>();
    const deals = new Set<string>();
    const stages = new Map<string, Set<string>>();
    const attributes = new Map<
      string,
      { title: string; attribute_type: string }
    >();

    // Step 4: Validate and remove unused columns
    const validatedData = cleanedData.map((table) => {
      const validatedRecords = table.data.map((record: any) => {
        const errors: string[] = [];
        const newRecord: Record<string, any> = { ...record };

        // Remove unused attribute columns
        Object.keys(newRecord).forEach((key) => {
          if (
            attributesToRemove.has(key) ||
            (key.match(/^contact_\d+$/) &&
              attributesToRemove.has(
                `deal_attribute_${parseInt(key.split('_')[1]) - 10}`,
              ))
          ) {
            delete newRecord[key];
          }
        });

        if (table.tableName === 'Attribute') {
          const attr = newRecord as AttributeDto;
          if (
            attr.title &&
            !this.VALID_ATTRIBUTE_TYPES.includes(attr.attribute_type)
          ) {
            errors.push(
              `Invalid type '${attr.attribute_type}', must be one of ${this.VALID_ATTRIBUTE_TYPES.join(', ')}`,
            );
          }
          if (attr.title && !attr.attribute_type) {
            errors.push('Type is empty but title is provided');
          }
          if (!attr.title && attr.attribute_type) {
            errors.push('Title is empty but type is provided');
          }
          attributes.set(attr.identifier, {
            title: attr.title,
            attribute_type: attr.attribute_type,
          });
        }

        if (table.tableName === 'Contact') {
          const contact = newRecord as ContactDto;
          if (!contact.name) errors.push('Missing required field: name');
          if (!contact.email) errors.push('Missing required field: email');
          else if (!this.EMAIL_REGEX.test(contact.email))
            errors.push('Invalid email format');
          if (!contact.phone) errors.push('Missing required field: phone');
          else if (!this.PHONE_REGEX.test(contact.phone))
            errors.push('Invalid phone format');
          if (!contact.organization_name)
            errors.push('Missing required field: organization_name');

          Object.keys(contact).forEach((key) => {
            if (key.startsWith('contact_attribute_')) {
              const attr = attributes.get(key);
              if (attr && attr.attribute_type && contact[key]) {
                this.validateAttributeValue(
                  contact[key],
                  attr.attribute_type,
                  key,
                  errors,
                );
              }
              if (contact[key] && (!attr || !attr.title)) {
                errors.push(`${key} used but not defined in Attribute table`);
              }
            }
          });

          if (contact.name) {
            if (contacts.has(contact.name)) {
              errors.push('Duplicate contact name');
            }
            contacts.add(contact.name);
          }
        }

        if (table.tableName === 'Organization') {
          const org = newRecord as OrganizationDto;
          if (!org.name) errors.push('Missing required field: name');

          Object.keys(org).forEach((key) => {
            if (key.startsWith('organization_attribute_')) {
              const attr = attributes.get(key);
              if (attr && attr.attribute_type && org[key]) {
                this.validateAttributeValue(
                  org[key],
                  attr.attribute_type,
                  key,
                  errors,
                );
              }
              if (org[key] && (!attr || !attr.title)) {
                errors.push(`${key} used but not defined in Attribute table`);
              }
              if (
                key === 'organization_attribute_3' &&
                org[key] &&
                !this.URL_REGEX.test(org[key])
              ) {
                errors.push(
                  'Invalid URL format for organization_attribute_3 (Website)',
                );
              }
            }
          });

          if (org.name) {
            if (organizations.has(org.name)) {
              errors.push('Duplicate organization name');
            }
            organizations.add(org.name);
          }
        }

        if (table.tableName === 'Deal') {
          const deal = newRecord as DealDto;
          if (!deal.address) errors.push('Missing required field: address');
          if (!deal.nickname) errors.push('Missing required field: nickname');
          if (!deal.board_name)
            errors.push('Missing required field: board_name');
          if (!deal.stage_name)
            errors.push('Missing required field: stage_name');

          Object.keys(deal).forEach((key) => {
            if (
              key.startsWith('assignee_') &&
              deal[key] &&
              !this.TEAM_USERS.includes(deal[key])
            ) {
              errors.push(
                `${key} (${deal[key]}) not in team user list [${this.TEAM_USERS.join(', ')}]`,
              );
            }
            if (
              key.startsWith('editor_') &&
              deal[key] &&
              !this.TEAM_USERS.includes(deal[key])
            ) {
              errors.push(
                `${key} (${deal[key]}) not in team user list [${this.TEAM_USERS.join(', ')}]`,
              );
            }
          });

          Object.keys(deal).forEach((key) => {
            if (key.match(/^contact_\d+$/) && deal[key]) {
              const contactIndex = parseInt(key.split('_')[1]);
              if (contactIndex <= 10) {
                if (!contacts.has(deal[key])) {
                  errors.push(
                    `${key} (${deal[key]}) does not match any contact name`,
                  );
                }
              } else {
                const attrNum = contactIndex - 10;
                const identifier = `deal_attribute_${attrNum}`;
                const attr = attributes.get(identifier);
                if (deal[key] && (!attr || !attr.title)) {
                  errors.push(
                    `${key} used but ${identifier} not defined in Attribute table`,
                  );
                }
                if (attr && attr.attribute_type && deal[key]) {
                  this.validateAttributeValue(
                    deal[key],
                    attr.attribute_type,
                    key,
                    errors,
                  );
                }
              }
            }
          });

          Object.keys(deal).forEach((key) => {
            if (key.startsWith('deal_attribute_')) {
              const attr = attributes.get(key);
              if (deal[key] && (!attr || !attr.title)) {
                errors.push(`${key} used but not defined in Attribute table`);
              }
              if (attr && attr.attribute_type && deal[key]) {
                this.validateAttributeValue(
                  deal[key],
                  attr.attribute_type,
                  key,
                  errors,
                );
              }
            }
          });

          if (
            (deal.contact_11 ||
              deal.contact_12 ||
              deal.contact_13 ||
              deal.contact_14) &&
            !(
              deal.deal_attribute_1 ||
              deal.deal_attribute_2 ||
              deal.deal_attribute_3 ||
              deal.deal_attribute_4
            )
          ) {
            errors.push(
              'deal_attribute_1 to deal_attribute_4 are empty but contact_11 to contact_14 are used',
            );
          }

          if (deal.nickname) {
            if (deals.has(deal.nickname)) {
              errors.push('Duplicate deal nickname');
            }
            deals.add(deal.nickname);
          }
        }

        if (table.tableName === 'Stage') {
          const stage = newRecord as StageDto;
          if (!stage.board_name)
            errors.push('Missing required field: board_name');
          if (!stage.stage_name)
            errors.push('Missing required field: stage_name');
          if (
            !stage.order_index ||
            isNaN(parseInt(stage.order_index)) ||
            parseInt(stage.order_index) < 0
          ) {
            errors.push('Invalid order_index: must be a non-negative integer');
          }

          if (stage.board_name && stage.stage_name) {
            if (!stages.has(stage.board_name)) {
              stages.set(stage.board_name, new Set());
            }
            stages.get(stage.board_name)!.add(stage.stage_name);
          }
        }

        return errors.length > 0
          ? { ...newRecord, error: errors.join('; ') }
          : newRecord;
      });

      return { ...table, data: validatedRecords };
    });

    // Step 5: Cross-table validations
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
          if (record.board_name && record.stage_name) {
            const stageSet = stages.get(record.board_name);
            if (!stageSet || !stageSet.has(record.stage_name)) {
              const errors = record.error ? record.error.split('; ') : [];
              errors.push(
                `board_name (${record.board_name}) and stage_name (${record.stage_name}) do not match any stage`,
              );
              record.error = errors.join('; ');
            }
          }
        });
      }
    });

    return { tables: validatedData };
  }

  private validateAttributeValue(
    value: string,
    attribute_type: string,
    field: string,
    errors: string[],
  ) {
    if (attribute_type === 'number' || attribute_type === 'money') {
      if (isNaN(parseFloat(value))) {
        errors.push(`${field} should be a number, found string '${value}'`);
      }
    } else if (attribute_type === 'date') {
      if (!this.DATE_REGEX.test(value) || isNaN(Date.parse(value))) {
        errors.push(
          `${field} should be a valid date (YYYY-MM-DD), found '${value}'`,
        );
      }
    }
  }
}
