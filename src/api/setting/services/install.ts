import type { Event } from '@strapi/database/dist/lifecycles';

export default () => ({
  async autoInstall(event: Event) {
    const { action, model } = event;
    if (
      model.uid !== 'plugin::users-permissions.user' ||
      action !== 'afterCreate'
    ) {
      return;
    }

    console.log('Auto install...');

    const count = await strapi.db
      .query('plugin::users-permissions.user')
      .count();

    if (count > 1) {
      return;
    }

    // default menus
    await strapi.db.query('api::setting.setting').create({
      data: {
        category: 'system',
        name: 'menus',
        value: [
          {
            key: '_accounts',
            uid: 'api::account.account',
            icon: 'bank',
            name: 'Account',
            isCRM: true,
            label: 'Account',
            weight: 1,
            children: [
              {
                key: '/collections/accounts',
                label: 'Account List',
              },
              {
                key: '/collections/accounts/create',
                label: 'Create Account',
              },
            ],
            attributes: {
              fax: {
                type: 'string',
              },
              name: {
                type: 'string',
                unique: true,
                required: true,
              },
              type: {
                enum: ['Direct', 'Agency'],
                type: 'enumeration',
              },
              phone: {
                type: 'string',
              },
              locale: {
                type: 'string',
                private: true,
                visible: false,
                writable: true,
                configurable: false,
              },
              address: {
                type: 'component',
                component: 'common.address',
                repeatable: false,
              },
              website: {
                type: 'string',
              },
              contacts: {
                type: 'relation',
                target: 'api::contact.contact',
                mappedBy: 'account',
                relation: 'oneToMany',
              },
              createdAt: {
                type: 'datetime',
              },
              createdBy: {
                type: 'relation',
                target: 'admin::user',
                private: true,
                visible: false,
                relation: 'oneToOne',
                writable: false,
                configurable: false,
                useJoinTable: false,
              },
              shortName: {
                type: 'string',
              },
              updatedAt: {
                type: 'datetime',
              },
              updatedBy: {
                type: 'relation',
                target: 'admin::user',
                private: true,
                visible: false,
                relation: 'oneToOne',
                writable: false,
                configurable: false,
                useJoinTable: false,
              },
              description: {
                type: 'richtext',
              },
              publishedAt: {
                type: 'datetime',
                visible: false,
                writable: true,
                configurable: false,
              },
              assigned_user: {
                type: 'relation',
                target: 'plugin::users-permissions.user',
                relation: 'manyToOne',
                inversedBy: 'accounts',
              },
              localizations: {
                type: 'relation',
                target: 'api::account.account',
                private: true,
                visible: false,
                relation: 'oneToMany',
                writable: false,
                joinColumn: {
                  name: 'document_id',
                  referencedTable: 'accounts',
                  referencedColumn: 'document_id',
                },
                configurable: false,
                unstable_virtual: true,
              },
            },
            collection: 'accounts',
            pluralName: 'accounts',
            singularName: 'account',
          },
          {
            key: '_contacts',
            uid: 'api::contact.contact',
            icon: 'contacts',
            name: 'Contact',
            label: 'Contact',
            weight: 2,
            children: [
              {
                key: '/collections/contacts',
                label: 'Contact List',
              },
              {
                key: '/collections/contacts/create',
                label: 'Create Contact',
              },
            ],
            collection: 'contacts',
            pluralName: 'contacts',
            singularName: 'contact',
          },
          {
            key: '_leads',
            uid: 'api::lead.lead',
            icon: 'useradd',
            name: 'Lead',
            isCRM: true,
            label: 'Lead',
            weight: 3,
            children: [
              {
                key: '/collections/leads',
                label: 'Lead List',
              },
              {
                key: '/collections/leads/create',
                label: 'Create Lead',
              },
            ],
            attributes: {
              email: {
                type: 'string',
              },
              phone: {
                type: 'string',
              },
              locale: {
                type: 'string',
                private: true,
                visible: false,
                writable: true,
                configurable: false,
              },
              mobile: {
                type: 'string',
              },
              address: {
                type: 'component',
                component: 'common.address',
                repeatable: false,
              },
              website: {
                type: 'string',
              },
              jobTitle: {
                type: 'string',
              },
              lastName: {
                type: 'string',
                required: true,
              },
              createdAt: {
                type: 'datetime',
              },
              createdBy: {
                type: 'relation',
                target: 'admin::user',
                private: true,
                visible: false,
                relation: 'oneToOne',
                writable: false,
                configurable: false,
                useJoinTable: false,
              },
              firstName: {
                type: 'string',
              },
              updatedAt: {
                type: 'datetime',
              },
              updatedBy: {
                type: 'relation',
                target: 'admin::user',
                private: true,
                visible: false,
                relation: 'oneToOne',
                writable: false,
                configurable: false,
                useJoinTable: false,
              },
              department: {
                type: 'string',
              },
              leadSource: {
                enum: ['Campaign', 'Website'],
                type: 'enumeration',
              },
              leadStatus: {
                enum: ['New', 'Assigned', 'In Process', 'Converted'],
                type: 'enumeration',
                default: 'New',
              },
              salutation: {
                enum: ['Ms.', 'Mr.', 'Miss'],
                type: 'enumeration',
              },
              description: {
                type: 'richtext',
              },
              publishedAt: {
                type: 'datetime',
                visible: false,
                writable: true,
                configurable: false,
              },
              localizations: {
                type: 'relation',
                target: 'api::lead.lead',
                private: true,
                visible: false,
                relation: 'oneToMany',
                writable: false,
                joinColumn: {
                  name: 'document_id',
                  referencedTable: 'leads',
                  referencedColumn: 'document_id',
                },
                configurable: false,
                unstable_virtual: true,
              },
            },
            collection: 'leads',
            pluralName: 'leads',
            singularName: 'lead',
          },
          {
            key: '_opportunities',
            uid: 'api::opportunity.opportunity',
            icon: 'project',
            name: 'Opportunity',
            isCRM: true,
            label: 'Opportunity',
            weight: 4,
            children: [
              {
                key: '/collections/opportunities',
                label: 'Opportunity List',
              },
              {
                key: '/opportunities/kanban',
                label: 'Kanban',
              },
              {
                key: '/collections/opportunities/create',
                label: 'Create Opportunity',
              },
            ],
            attributes: {
              name: {
                type: 'string',
                required: true,
              },
              type: {
                enum: ['Exist Business', 'New Business'],
                type: 'enumeration',
                default: 'Exist Business',
              },
              stage: {
                enum: [
                  'Prospecting',
                  'Qualification',
                  'Needs Analysis',
                  'Value Proposition',
                  'Identifying Decision Makers',
                  'Perception Analysis',
                  'Proposal/Price Quote',
                  'Negotiation/Review',
                  'Closed Won',
                  'Closed Lost',
                ],
                type: 'enumeration',
                default: 'Prospecting',
                required: true,
              },
              amount: {
                type: 'decimal',
              },
              locale: {
                type: 'string',
                private: true,
                visible: false,
                writable: true,
                configurable: false,
              },
              account: {
                type: 'relation',
                target: 'api::account.account',
                relation: 'manyToOne',
                inversedBy: 'opportunities',
              },
              nextStep: {
                type: 'string',
              },
              closeDate: {
                type: 'date',
              },
              createdAt: {
                type: 'datetime',
              },
              createdBy: {
                type: 'relation',
                target: 'admin::user',
                private: true,
                visible: false,
                relation: 'oneToOne',
                writable: false,
                configurable: false,
                useJoinTable: false,
              },
              updatedAt: {
                type: 'datetime',
              },
              updatedBy: {
                type: 'relation',
                target: 'admin::user',
                private: true,
                visible: false,
                relation: 'oneToOne',
                writable: false,
                configurable: false,
                useJoinTable: false,
              },
              leadSource: {
                enum: ['Campaign', 'Website'],
                type: 'enumeration',
              },
              description: {
                type: 'richtext',
              },
              probability: {
                type: 'string',
              },
              publishedAt: {
                type: 'datetime',
                visible: false,
                writable: true,
                configurable: false,
              },
              assigned_user: {
                type: 'relation',
                target: 'plugin::users-permissions.user',
                relation: 'manyToOne',
                inversedBy: 'opportunities',
              },
              localizations: {
                type: 'relation',
                target: 'api::opportunity.opportunity',
                private: true,
                visible: false,
                relation: 'oneToMany',
                writable: false,
                joinColumn: {
                  name: 'document_id',
                  referencedTable: 'opportunities',
                  referencedColumn: 'document_id',
                },
                configurable: false,
                unstable_virtual: true,
              },
            },
            collection: 'opportunities',
            pluralName: 'opportunities',
            singularName: 'opportunity',
          },
          {
            key: '_notes',
            uid: 'api::note.note',
            icon: 'filezip',
            name: 'Note',
            isCRM: true,
            label: 'Note',
            weight: 5,
            children: [
              {
                key: '/collections/notes',
                label: 'Note List',
              },
              {
                key: '/collections/notes/create',
                label: 'Create Note',
              },
            ],
            attributes: {
              name: {
                type: 'string',
                required: true,
              },
              note: {
                type: 'richtext',
              },
              type: {
                enum: ['Document', 'Note'],
                type: 'enumeration',
                default: 'Document',
              },
              locale: {
                type: 'string',
                private: true,
                visible: false,
                writable: true,
                configurable: false,
              },
              document: {
                type: 'media',
                multiple: false,
                allowedTypes: ['images', 'files', 'videos', 'audios'],
              },
              createdAt: {
                type: 'datetime',
              },
              createdBy: {
                type: 'relation',
                target: 'admin::user',
                private: true,
                visible: false,
                relation: 'oneToOne',
                writable: false,
                configurable: false,
                useJoinTable: false,
              },
              updatedAt: {
                type: 'datetime',
              },
              updatedBy: {
                type: 'relation',
                target: 'admin::user',
                private: true,
                visible: false,
                relation: 'oneToOne',
                writable: false,
                configurable: false,
                useJoinTable: false,
              },
              publishedAt: {
                type: 'datetime',
                visible: false,
                writable: true,
                configurable: false,
              },
              assigned_user: {
                type: 'relation',
                target: 'plugin::users-permissions.user',
                relation: 'manyToOne',
                inversedBy: 'notes',
              },
              localizations: {
                type: 'relation',
                target: 'api::note.note',
                private: true,
                visible: false,
                relation: 'oneToMany',
                writable: false,
                joinColumn: {
                  name: 'document_id',
                  referencedTable: 'notes',
                  referencedColumn: 'document_id',
                },
                configurable: false,
                unstable_virtual: true,
              },
            },
            collection: 'notes',
            pluralName: 'notes',
            singularName: 'note',
          },
          {
            key: '_users',
            uid: 'plugin::users-permissions.user',
            icon: 'users',
            name: 'User',
            label: 'User',
            weight: 6,
            children: [
              {
                key: '/users',
                label: 'User List',
              },
              {
                key: '/users/create',
                label: 'Create User',
              },
            ],
            collection: 'users',
            pluralName: 'users',
            singularName: 'user',
          },
          {
            key: '_settings',
            uid: 'api::setting.setting',
            icon: 'setting',
            name: 'Setting',
            label: 'Setting',
            weight: 7,
            children: [
              {
                key: '/settings',
                label: 'General Settings',
              },
            ],
            collection: 'settings',
            pluralName: 'settings',
            singularName: 'setting',
          },
        ],
      },
    });

    // default roles/permissions
    await strapi.db.query('plugin::users-permissions.role').create({
      data: {
        name: 'Administrator',
        description: 'Administrator',
        type: 'administrator',
      },
    });
  },
});
