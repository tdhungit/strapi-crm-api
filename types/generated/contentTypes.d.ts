import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminSession extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_sessions';
  info: {
    description: 'Session Manager storage';
    displayName: 'Session';
    name: 'Session';
    pluralName: 'sessions';
    singularName: 'session';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    absoluteExpiresAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    childId: Schema.Attribute.String & Schema.Attribute.Private;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deviceId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::session'> &
      Schema.Attribute.Private;
    origin: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sessionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique;
    status: Schema.Attribute.String & Schema.Attribute.Private;
    type: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    userId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAccountAccount extends Struct.CollectionTypeSchema {
  collectionName: 'accounts';
  info: {
    displayName: 'Account';
    pluralName: 'accounts';
    singularName: 'account';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.Component<'common.address', false>;
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    contacts: Schema.Attribute.Relation<'oneToMany', 'api::contact.contact'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    email: Schema.Attribute.Email;
    fax: Schema.Attribute.String;
    industry: Schema.Attribute.Enumeration<
      [
        'Technology',
        'Telecommunications',
        'Financial Services',
        'Insurance',
        'Healthcare',
        'Pharmaceuticals / Biotechnology',
        'Manufacturing',
        'Automotive',
        'Energy / Utilities',
        'Construction',
        'Real Estate',
        'Retail',
        'Consumer Goods',
        'Food & Beverages',
        'Transportation & Logistics',
        'Education',
        'Media & Entertainment',
        'Hospitality / Travel / Tourism',
        'Government',
        'Nonprofit / NGO',
      ]
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::account.account'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    opportunities: Schema.Attribute.Relation<
      'oneToMany',
      'api::opportunity.opportunity'
    >;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sale_orders: Schema.Attribute.Relation<
      'oneToMany',
      'api::sale-order.sale-order'
    >;
    shortName: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['Direct', 'Agency']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    website: Schema.Attribute.String;
  };
}

export interface ApiAuditLogAuditLog extends Struct.CollectionTypeSchema {
  collectionName: 'audit_logs';
  info: {
    displayName: 'Audit Log';
    pluralName: 'audit-logs';
    singularName: 'audit-log';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    data: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::audit-log.audit-log'
    > &
      Schema.Attribute.Private;
    model: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    recordId: Schema.Attribute.Integer;
    timestamp: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCampaignActionCampaignAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'campaign_actions';
  info: {
    displayName: 'Campaign Action';
    pluralName: 'campaign-actions';
    singularName: 'campaign-action';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    action_status: Schema.Attribute.Enumeration<
      ['Ready', 'Running', 'Pending', 'Completed', 'Suspended']
    > &
      Schema.Attribute.DefaultTo<'Ready'>;
    campaign: Schema.Attribute.Relation<'manyToOne', 'api::campaign.campaign'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    error: Schema.Attribute.Integer;
    field_name: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::campaign-action.campaign-action'
    > &
      Schema.Attribute.Private;
    metadata: Schema.Attribute.JSON;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    run_at: Schema.Attribute.DateTime;
    schedule: Schema.Attribute.JSON;
    success: Schema.Attribute.Integer;
    target_field_name: Schema.Attribute.String;
    total: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiCampaignCampaign extends Struct.CollectionTypeSchema {
  collectionName: 'campaigns';
  info: {
    displayName: 'Campaign';
    pluralName: 'campaigns';
    singularName: 'campaign';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    campaign_actions: Schema.Attribute.Relation<
      'oneToMany',
      'api::campaign-action.campaign-action'
    >;
    campaign_status: Schema.Attribute.Enumeration<['Active', 'Inactive']> &
      Schema.Attribute.DefaultTo<'Active'>;
    campaign_type: Schema.Attribute.Enumeration<['Email']> &
      Schema.Attribute.DefaultTo<'Email'>;
    contacts: Schema.Attribute.Relation<'manyToMany', 'api::contact.contact'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    leads: Schema.Attribute.Relation<'manyToMany', 'api::lead.lead'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::campaign.campaign'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCartDetailCartDetail extends Struct.CollectionTypeSchema {
  collectionName: 'cart_details';
  info: {
    displayName: 'Cart Detail';
    pluralName: 'cart-details';
    singularName: 'cart-detail';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cart: Schema.Attribute.Relation<'manyToOne', 'api::cart.cart'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    discount_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    discount_type: Schema.Attribute.Enumeration<['percentage', 'amount']> &
      Schema.Attribute.DefaultTo<'percentage'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cart-detail.cart-detail'
    > &
      Schema.Attribute.Private;
    price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    product_variant: Schema.Attribute.Relation<
      'oneToOne',
      'api::product-variant.product-variant'
    >;
    publishedAt: Schema.Attribute.DateTime;
    quantity: Schema.Attribute.Integer & Schema.Attribute.Required;
    tax_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tax_type: Schema.Attribute.Enumeration<['percentage', 'amount']> &
      Schema.Attribute.DefaultTo<'percentage'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCartCart extends Struct.CollectionTypeSchema {
  collectionName: 'carts';
  info: {
    displayName: 'Cart';
    pluralName: 'carts';
    singularName: 'cart';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cart_details: Schema.Attribute.Relation<
      'oneToMany',
      'api::cart-detail.cart-detail'
    >;
    contact: Schema.Attribute.Relation<'oneToOne', 'api::contact.contact'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    discount_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    discount_type: Schema.Attribute.Enumeration<['percentage', 'amount']> &
      Schema.Attribute.DefaultTo<'percentage'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::cart.cart'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    subtotal: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tax_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tax_type: Schema.Attribute.Enumeration<['percentage', 'discount']> &
      Schema.Attribute.DefaultTo<'percentage'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCityCity extends Struct.CollectionTypeSchema {
  collectionName: 'cities';
  info: {
    displayName: 'City';
    pluralName: 'cities';
    singularName: 'city';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    latitude: Schema.Attribute.Float;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::city.city'> &
      Schema.Attribute.Private;
    longitude: Schema.Attribute.Float;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    state: Schema.Attribute.Relation<'manyToOne', 'api::state.state'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    zipcode: Schema.Attribute.Integer;
  };
}

export interface ApiContactAddressContactAddress
  extends Struct.CollectionTypeSchema {
  collectionName: 'contact_addresses';
  info: {
    displayName: 'Contact Address';
    pluralName: 'contact-addresses';
    singularName: 'contact-address';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.Text & Schema.Attribute.Required;
    city: Schema.Attribute.String & Schema.Attribute.Required;
    contact: Schema.Attribute.Relation<'manyToOne', 'api::contact.contact'>;
    country: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    is_default: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-address.contact-address'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    phone: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    so_shippings: Schema.Attribute.Relation<
      'oneToMany',
      'api::so-shipping.so-shipping'
    >;
    state: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    zipcode: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ApiContactContact extends Struct.CollectionTypeSchema {
  collectionName: 'contacts';
  info: {
    displayName: 'Contact';
    pluralName: 'contacts';
    singularName: 'contact';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    account: Schema.Attribute.Relation<'manyToOne', 'api::account.account'>;
    address: Schema.Attribute.Component<'common.address', false>;
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    avatar: Schema.Attribute.String;
    bod: Schema.Attribute.Date;
    campaigns: Schema.Attribute.Relation<
      'manyToMany',
      'api::campaign.campaign'
    >;
    contact_addresses: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-address.contact-address'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    department: Schema.Attribute.String;
    description: Schema.Attribute.RichText;
    email: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    firstName: Schema.Attribute.String;
    jobTitle: Schema.Attribute.String;
    lastName: Schema.Attribute.String & Schema.Attribute.Required;
    lead: Schema.Attribute.Relation<'oneToOne', 'api::lead.lead'>;
    leadSource: Schema.Attribute.Enumeration<['Campaign', 'Website']>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact.contact'
    > &
      Schema.Attribute.Private;
    login_provider: Schema.Attribute.Enumeration<
      ['Local', 'Google', 'Facebook', 'X']
    > &
      Schema.Attribute.DefaultTo<'Local'>;
    login_provider_sid: Schema.Attribute.String;
    mobile: Schema.Attribute.String;
    password: Schema.Attribute.Password;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sale_orders: Schema.Attribute.Relation<
      'oneToMany',
      'api::sale-order.sale-order'
    >;
    salutation: Schema.Attribute.Enumeration<
      ['Ms.', 'Mr.', 'Mrs.', 'Miss', 'Dr.']
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCountryCountry extends Struct.CollectionTypeSchema {
  collectionName: 'countries';
  info: {
    displayName: 'Country';
    pluralName: 'countries';
    singularName: 'country';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
  };
  attributes: {
    capital: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currency: Schema.Attribute.String;
    currency_name: Schema.Attribute.String;
    currency_symbol: Schema.Attribute.String;
    iso2: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2;
      }>;
    iso3: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 3;
      }>;
    latitude: Schema.Attribute.Float;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::country.country'
    > &
      Schema.Attribute.Private;
    longitude: Schema.Attribute.Float;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    phonecode: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    region: Schema.Attribute.String;
    states: Schema.Attribute.Relation<'oneToMany', 'api::state.state'>;
    timezones: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCouponCoupon extends Struct.CollectionTypeSchema {
  collectionName: 'coupons';
  info: {
    displayName: 'Coupon';
    pluralName: 'coupons';
    singularName: 'coupon';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    coupon_status: Schema.Attribute.Enumeration<['Active', 'Inactive']> &
      Schema.Attribute.DefaultTo<'Active'>;
    coupon_type: Schema.Attribute.Enumeration<['Shipping', 'Sale Order']> &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    discount_type: Schema.Attribute.Enumeration<['percentage', 'amount']> &
      Schema.Attribute.DefaultTo<'percentage'>;
    discount_value: Schema.Attribute.Decimal;
    end_date: Schema.Attribute.Date;
    limited: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::coupon.coupon'
    > &
      Schema.Attribute.Private;
    max_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    min_order_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    sale_orders: Schema.Attribute.Relation<
      'manyToMany',
      'api::sale-order.sale-order'
    >;
    start_date: Schema.Attribute.Date;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    used: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface ApiDepartmentDepartment extends Struct.CollectionTypeSchema {
  collectionName: 'departments';
  info: {
    displayName: 'Department';
    pluralName: 'departments';
    singularName: 'department';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Blocks;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::department.department'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    permissions: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiEmailTemplateEmailTemplate
  extends Struct.CollectionTypeSchema {
  collectionName: 'email_templates';
  info: {
    displayName: 'Email Template';
    pluralName: 'email-templates';
    singularName: 'email-template';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    content: Schema.Attribute.RichText;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    for_module: Schema.Attribute.Enumeration<
      ['Accounts', 'Contacts', 'Leads', 'Opportunities']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Accounts'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::email-template.email-template'
    > &
      Schema.Attribute.Private;
    mail_histories: Schema.Attribute.Relation<
      'oneToMany',
      'api::mail-history.mail-history'
    >;
    publishedAt: Schema.Attribute.DateTime;
    rawContent: Schema.Attribute.JSON;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['HTML', 'Text']> &
      Schema.Attribute.DefaultTo<'HTML'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiGlobalSettingGlobalSetting extends Struct.SingleTypeSchema {
  collectionName: 'global_settings';
  info: {
    displayName: 'Global Setting';
    pluralName: 'global-settings';
    singularName: 'global-setting';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    favicon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    footer: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::global-setting.global-setting'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    publishedAt: Schema.Attribute.DateTime;
    slogan: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHomePageHomePage extends Struct.SingleTypeSchema {
  collectionName: 'home_pages';
  info: {
    displayName: 'Home Page';
    pluralName: 'home-pages';
    singularName: 'home-page';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::home-page.home-page'
    > &
      Schema.Attribute.Private;
    main_banners: Schema.Attribute.Component<'page.banner', true>;
    product_categories: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-category.product-category'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiImportImport extends Struct.CollectionTypeSchema {
  collectionName: 'imports';
  info: {
    displayName: 'Import';
    pluralName: 'imports';
    singularName: 'import';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
  };
  attributes: {
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    error: Schema.Attribute.Integer;
    fieldMappings: Schema.Attribute.JSON;
    fileName: Schema.Attribute.String & Schema.Attribute.Required;
    filePath: Schema.Attribute.String & Schema.Attribute.Required;
    importStatus: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::import.import'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    success: Schema.Attribute.Integer;
    total: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiInventoryManualDetailInventoryManualDetail
  extends Struct.CollectionTypeSchema {
  collectionName: 'inventory_manual_details';
  info: {
    displayName: 'Inventory Manual Detail';
    pluralName: 'inventory-manual-details';
    singularName: 'inventory-manual-detail';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    inventory_manual: Schema.Attribute.Relation<
      'manyToOne',
      'api::inventory-manual.inventory-manual'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::inventory-manual-detail.inventory-manual-detail'
    > &
      Schema.Attribute.Private;
    price: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    product_variant: Schema.Attribute.Relation<
      'oneToOne',
      'api::product-variant.product-variant'
    >;
    publishedAt: Schema.Attribute.DateTime;
    quantity: Schema.Attribute.Integer & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warehouse: Schema.Attribute.Relation<
      'oneToOne',
      'api::warehouse.warehouse'
    >;
  };
}

export interface ApiInventoryManualInventoryManual
  extends Struct.CollectionTypeSchema {
  collectionName: 'inventory_manuals';
  info: {
    displayName: 'Inventory Manual';
    pluralName: 'inventory-manuals';
    singularName: 'inventory-manual';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    created_user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    details: Schema.Attribute.Relation<
      'oneToMany',
      'api::inventory-manual-detail.inventory-manual-detail'
    >;
    inventory_status: Schema.Attribute.Enumeration<
      ['New', 'Approved', 'Rejected']
    > &
      Schema.Attribute.DefaultTo<'New'>;
    inventory_type: Schema.Attribute.Enumeration<['Manual', 'Import']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Manual'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::inventory-manual.inventory-manual'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warehouse: Schema.Attribute.Relation<
      'oneToOne',
      'api::warehouse.warehouse'
    >;
  };
}

export interface ApiInventoryInventory extends Struct.CollectionTypeSchema {
  collectionName: 'inventories';
  info: {
    displayName: 'Inventory';
    pluralName: 'inventories';
    singularName: 'inventory';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    last_updated: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::inventory.inventory'
    > &
      Schema.Attribute.Private;
    product_variant: Schema.Attribute.Relation<
      'manyToOne',
      'api::product-variant.product-variant'
    >;
    publishedAt: Schema.Attribute.DateTime;
    stock_quantity: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warehouse: Schema.Attribute.Relation<
      'manyToOne',
      'api::warehouse.warehouse'
    >;
  };
}

export interface ApiInvoiceDetailInvoiceDetail
  extends Struct.CollectionTypeSchema {
  collectionName: 'invoice_details';
  info: {
    displayName: 'Invoice Detail';
    pluralName: 'invoice-details';
    singularName: 'invoice-detail';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    discount_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    invoice: Schema.Attribute.Relation<'manyToOne', 'api::invoice.invoice'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::invoice-detail.invoice-detail'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    product_variant: Schema.Attribute.Relation<
      'oneToOne',
      'api::product-variant.product-variant'
    >;
    publishedAt: Schema.Attribute.DateTime;
    quantity: Schema.Attribute.Integer & Schema.Attribute.Required;
    subtotal: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tax_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    unit_price: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiInvoiceInvoice extends Struct.CollectionTypeSchema {
  collectionName: 'invoices';
  info: {
    displayName: 'Invoice';
    pluralName: 'invoices';
    singularName: 'invoice';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    account_tax: Schema.Attribute.Relation<'oneToOne', 'api::account.account'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    discount_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    due_date: Schema.Attribute.Date;
    invoice_details: Schema.Attribute.Relation<
      'oneToMany',
      'api::invoice-detail.invoice-detail'
    >;
    invoice_number: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    invoice_status: Schema.Attribute.String & Schema.Attribute.Required;
    invoice_tax_amount: Schema.Attribute.Decimal &
      Schema.Attribute.DefaultTo<0>;
    issue_date: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::invoice.invoice'
    > &
      Schema.Attribute.Private;
    payment: Schema.Attribute.Relation<'manyToOne', 'api::payment.payment'>;
    publishedAt: Schema.Attribute.DateTime;
    sale_order: Schema.Attribute.Relation<
      'manyToOne',
      'api::sale-order.sale-order'
    >;
    subtotal: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tax_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    total_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLeadLead extends Struct.CollectionTypeSchema {
  collectionName: 'leads';
  info: {
    displayName: 'Lead';
    pluralName: 'leads';
    singularName: 'lead';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.Component<'common.address', false>;
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    campaigns: Schema.Attribute.Relation<
      'manyToMany',
      'api::campaign.campaign'
    >;
    contact: Schema.Attribute.Relation<'oneToOne', 'api::contact.contact'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    department: Schema.Attribute.String;
    description: Schema.Attribute.RichText;
    email: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    firstName: Schema.Attribute.String;
    jobTitle: Schema.Attribute.String;
    lastName: Schema.Attribute.String & Schema.Attribute.Required;
    leadSource: Schema.Attribute.Enumeration<['Campaign', 'Website']>;
    leadStatus: Schema.Attribute.Enumeration<
      ['New', 'Assigned', 'In Process', 'Converted']
    > &
      Schema.Attribute.DefaultTo<'New'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::lead.lead'> &
      Schema.Attribute.Private;
    mobile: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    salutation: Schema.Attribute.Enumeration<['Ms.', 'Mr.', 'Miss']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    website: Schema.Attribute.String;
  };
}

export interface ApiMailHistoryMailHistory extends Struct.CollectionTypeSchema {
  collectionName: 'mail_histories';
  info: {
    displayName: 'Mail History';
    pluralName: 'mail-histories';
    singularName: 'mail-history';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
  };
  attributes: {
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    clicked: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    delivered: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    email_template: Schema.Attribute.Relation<
      'manyToOne',
      'api::email-template.email-template'
    >;
    from_email: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::mail-history.mail-history'
    > &
      Schema.Attribute.Private;
    mail_status: Schema.Attribute.String;
    metadata: Schema.Attribute.JSON;
    model: Schema.Attribute.String;
    opened: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    record_id: Schema.Attribute.Integer;
    service_sid: Schema.Attribute.String;
    source: Schema.Attribute.String;
    source_id: Schema.Attribute.Integer;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    to_email: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNoteNote extends Struct.CollectionTypeSchema {
  collectionName: 'notes';
  info: {
    displayName: 'Note';
    pluralName: 'notes';
    singularName: 'note';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    document: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::note.note'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    note: Schema.Attribute.RichText;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['Document', 'Note']> &
      Schema.Attribute.DefaultTo<'Document'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiOpportunityOpportunity extends Struct.CollectionTypeSchema {
  collectionName: 'opportunities';
  info: {
    displayName: 'Opportunity';
    pluralName: 'opportunities';
    singularName: 'opportunity';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    account: Schema.Attribute.Relation<'manyToOne', 'api::account.account'>;
    amount: Schema.Attribute.Decimal;
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    closeDate: Schema.Attribute.Date;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    leadSource: Schema.Attribute.Enumeration<['Campaign', 'Website']>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::opportunity.opportunity'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    nextStep: Schema.Attribute.String;
    probability: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    ranking: Schema.Attribute.Integer &
      Schema.Attribute.CustomField<'plugin::crm-fields.ranking'>;
    stage: Schema.Attribute.Enumeration<
      [
        'Prospecting',
        'Qualification',
        'Needs Analysis',
        'Value Proposition',
        'Identifying Decision Makers',
        'Perception Analysis',
        'Proposal',
        'Negotiation',
        'Closed Won',
        'Closed Lost',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Prospecting'>;
    type: Schema.Attribute.Enumeration<['Exist Business', 'New Business']> &
      Schema.Attribute.DefaultTo<'Exist Business'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPaymentMethodPaymentMethod
  extends Struct.CollectionTypeSchema {
  collectionName: 'payment_methods';
  info: {
    displayName: 'Payment Method';
    pluralName: 'payment-methods';
    singularName: 'payment-method';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment-method.payment-method'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    options: Schema.Attribute.JSON;
    payments: Schema.Attribute.Relation<'oneToMany', 'api::payment.payment'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPaymentPayment extends Struct.CollectionTypeSchema {
  collectionName: 'payments';
  info: {
    displayName: 'Payment';
    pluralName: 'payments';
    singularName: 'payment';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount: Schema.Attribute.Decimal & Schema.Attribute.Required;
    created_user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    invoices: Schema.Attribute.Relation<'oneToMany', 'api::invoice.invoice'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment.payment'
    > &
      Schema.Attribute.Private;
    method: Schema.Attribute.Relation<
      'manyToOne',
      'api::payment-method.payment-method'
    >;
    payment_date: Schema.Attribute.Date & Schema.Attribute.Required;
    payment_method: Schema.Attribute.String & Schema.Attribute.Required;
    payment_status: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    sale_order: Schema.Attribute.Relation<
      'manyToOne',
      'api::sale-order.sale-order'
    >;
    transaction_id: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProductAttributeProductAttribute
  extends Struct.CollectionTypeSchema {
  collectionName: 'product_attributes';
  info: {
    displayName: 'Product Attribute';
    pluralName: 'product-attributes';
    singularName: 'product-attribute';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-attribute.product-attribute'
    > &
      Schema.Attribute.Private;
    metadata: Schema.Attribute.JSON;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    product_category: Schema.Attribute.Relation<
      'manyToOne',
      'api::product-category.product-category'
    >;
    product_variant_attributes: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-variant-attribute.product-variant-attribute'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    weight: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface ApiProductCategoryProductCategory
  extends Struct.CollectionTypeSchema {
  collectionName: 'product_categories';
  info: {
    displayName: 'Product Category';
    pluralName: 'product-categories';
    singularName: 'product-category';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-category.product-category'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    parent: Schema.Attribute.Relation<
      'manyToOne',
      'api::product-category.product-category'
    >;
    product_attributes: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-attribute.product-attribute'
    >;
    product_categories: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-category.product-category'
    >;
    products: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    weight: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface ApiProductPriceListProductPriceList
  extends Struct.CollectionTypeSchema {
  collectionName: 'product_price_lists';
  info: {
    displayName: 'Product Price List';
    pluralName: 'product-price-lists';
    singularName: 'product-price-list';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    end_date: Schema.Attribute.Date;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-price-list.product-price-list'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    price_list_status: Schema.Attribute.Enumeration<['Active', 'Inactive']> &
      Schema.Attribute.DefaultTo<'Active'>;
    product_prices: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-price.product-price'
    >;
    publishedAt: Schema.Attribute.DateTime;
    start_date: Schema.Attribute.Date;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiProductPriceProductPrice
  extends Struct.CollectionTypeSchema {
  collectionName: 'product_prices';
  info: {
    displayName: 'Product Price';
    pluralName: 'product-prices';
    singularName: 'product-price';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    before_price: Schema.Attribute.Decimal;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    end_date: Schema.Attribute.Date;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-price.product-price'
    > &
      Schema.Attribute.Private;
    price: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    price_status: Schema.Attribute.Enumeration<['Active', 'Inactive']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Active'>;
    price_type: Schema.Attribute.Enumeration<['Cost', 'Sale']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Cost'>;
    product_price_list: Schema.Attribute.Relation<
      'manyToOne',
      'api::product-price-list.product-price-list'
    >;
    product_variant: Schema.Attribute.Relation<
      'manyToOne',
      'api::product-variant.product-variant'
    >;
    publishedAt: Schema.Attribute.DateTime;
    start_date: Schema.Attribute.Date;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProductVariantAttributeProductVariantAttribute
  extends Struct.CollectionTypeSchema {
  collectionName: 'product_variant_attributes';
  info: {
    displayName: 'Product Variant Attribute';
    pluralName: 'product-variant-attributes';
    singularName: 'product-variant-attribute';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    attribute_status: Schema.Attribute.Enumeration<['Active', 'Inactive']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Active'>;
    attribute_value: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-variant-attribute.product-variant-attribute'
    > &
      Schema.Attribute.Private;
    product_attribute: Schema.Attribute.Relation<
      'manyToOne',
      'api::product-attribute.product-attribute'
    >;
    product_variant: Schema.Attribute.Relation<
      'manyToOne',
      'api::product-variant.product-variant'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProductVariantProductVariant
  extends Struct.CollectionTypeSchema {
  collectionName: 'product_variants';
  info: {
    displayName: 'Product Variant';
    pluralName: 'product-variants';
    singularName: 'product-variant';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    barcode: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    inventories: Schema.Attribute.Relation<
      'oneToMany',
      'api::inventory.inventory'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-variant.product-variant'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    photos: Schema.Attribute.JSON;
    product: Schema.Attribute.Relation<'manyToOne', 'api::product.product'>;
    product_prices: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-price.product-price'
    >;
    product_variant_attributes: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-variant-attribute.product-variant-attribute'
    >;
    publishedAt: Schema.Attribute.DateTime;
    purchase_order_details: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-order-detail.purchase-order-detail'
    >;
    requires_shipping: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    sale_order_details: Schema.Attribute.Relation<
      'oneToMany',
      'api::sale-order-detail.sale-order-detail'
    >;
    sku: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    taxable: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    variant_status: Schema.Attribute.Enumeration<['Active', 'Inactive']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Active'>;
    weight: Schema.Attribute.Float;
    weight_unit: Schema.Attribute.String;
  };
}

export interface ApiProductProduct extends Struct.CollectionTypeSchema {
  collectionName: 'products';
  info: {
    displayName: 'Product';
    pluralName: 'products';
    singularName: 'product';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::product.product'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    photos: Schema.Attribute.JSON;
    product_category: Schema.Attribute.Relation<
      'manyToOne',
      'api::product-category.product-category'
    >;
    product_status: Schema.Attribute.Enumeration<['Active', 'Inactive']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Active'>;
    product_variants: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-variant.product-variant'
    >;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String;
    summary: Schema.Attribute.Text;
    unit: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPurchaseOrderDetailPurchaseOrderDetail
  extends Struct.CollectionTypeSchema {
  collectionName: 'purchase_order_details';
  info: {
    displayName: 'Purchase Order Detail';
    pluralName: 'purchase-order-details';
    singularName: 'purchase-order-detail';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    discount_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    discount_type: Schema.Attribute.Enumeration<['amount', 'percentage']> &
      Schema.Attribute.DefaultTo<'amount'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-order-detail.purchase-order-detail'
    > &
      Schema.Attribute.Private;
    product_variant: Schema.Attribute.Relation<
      'manyToOne',
      'api::product-variant.product-variant'
    >;
    publishedAt: Schema.Attribute.DateTime;
    purchase_order: Schema.Attribute.Relation<
      'manyToOne',
      'api::purchase-order.purchase-order'
    >;
    quantity: Schema.Attribute.Integer & Schema.Attribute.Required;
    subtotal: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tax_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tax_type: Schema.Attribute.Enumeration<['amount', 'percentage']> &
      Schema.Attribute.DefaultTo<'amount'>;
    unit_price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warehouse: Schema.Attribute.Relation<
      'manyToOne',
      'api::warehouse.warehouse'
    >;
  };
}

export interface ApiPurchaseOrderPurchaseOrder
  extends Struct.CollectionTypeSchema {
  collectionName: 'purchase_orders';
  info: {
    displayName: 'Purchase Order';
    pluralName: 'purchase-orders';
    singularName: 'purchase-order';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    discount_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    discount_type: Schema.Attribute.Enumeration<['amount', 'percentage']> &
      Schema.Attribute.DefaultTo<'amount'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-order.purchase-order'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    order_status: Schema.Attribute.Enumeration<
      ['New', 'In Progress', 'Pending', 'Approved', 'Rejected', 'Completed']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'New'>;
    publishedAt: Schema.Attribute.DateTime;
    purchase_date: Schema.Attribute.Date & Schema.Attribute.Required;
    purchase_order_details: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-order-detail.purchase-order-detail'
    >;
    subtotal: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    supplier: Schema.Attribute.Relation<'manyToOne', 'api::supplier.supplier'>;
    tax_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tax_type: Schema.Attribute.Enumeration<['amount', 'percentage']> &
      Schema.Attribute.DefaultTo<'amount'>;
    total_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    total_discount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    total_tax: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSaleOrderDetailSaleOrderDetail
  extends Struct.CollectionTypeSchema {
  collectionName: 'sale_order_details';
  info: {
    displayName: 'Sale Order Detail';
    pluralName: 'sale-order-details';
    singularName: 'sale-order-detail';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    discount_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    discount_type: Schema.Attribute.Enumeration<['percentage', 'amount']> &
      Schema.Attribute.DefaultTo<'percentage'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::sale-order-detail.sale-order-detail'
    > &
      Schema.Attribute.Private;
    product_variant: Schema.Attribute.Relation<
      'manyToOne',
      'api::product-variant.product-variant'
    >;
    publishedAt: Schema.Attribute.DateTime;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    sale_order: Schema.Attribute.Relation<
      'manyToOne',
      'api::sale-order.sale-order'
    >;
    subtotal: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tax_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tax_type: Schema.Attribute.Enumeration<['percentage', 'amount']> &
      Schema.Attribute.DefaultTo<'percentage'>;
    unit_price: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warehouse: Schema.Attribute.Relation<
      'manyToOne',
      'api::warehouse.warehouse'
    >;
  };
}

export interface ApiSaleOrderSaleOrder extends Struct.CollectionTypeSchema {
  collectionName: 'sale_orders';
  info: {
    displayName: 'Sale Order';
    pluralName: 'sale-orders';
    singularName: 'sale-order';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    account: Schema.Attribute.Relation<'manyToOne', 'api::account.account'>;
    assigned_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    contact: Schema.Attribute.Relation<'manyToOne', 'api::contact.contact'>;
    coupons: Schema.Attribute.Relation<'manyToMany', 'api::coupon.coupon'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    discount_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    discount_type: Schema.Attribute.Enumeration<['percentage', 'amount']> &
      Schema.Attribute.DefaultTo<'percentage'>;
    invoices: Schema.Attribute.Relation<'oneToMany', 'api::invoice.invoice'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::sale-order.sale-order'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    order_status: Schema.Attribute.Enumeration<
      ['New', 'In Progress', 'Pending', 'Approved', 'Rejected', 'Completed']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'New'>;
    payments: Schema.Attribute.Relation<'oneToMany', 'api::payment.payment'>;
    publishedAt: Schema.Attribute.DateTime;
    sale_date: Schema.Attribute.Date & Schema.Attribute.Required;
    sale_order_details: Schema.Attribute.Relation<
      'oneToMany',
      'api::sale-order-detail.sale-order-detail'
    >;
    shipping_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    shipping_discount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    so_shipping: Schema.Attribute.Relation<
      'oneToOne',
      'api::so-shipping.so-shipping'
    >;
    subtotal: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tax_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    tax_type: Schema.Attribute.Enumeration<['percentage', 'amount']> &
      Schema.Attribute.DefaultTo<'percentage'>;
    total_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    warehouse: Schema.Attribute.Relation<
      'manyToOne',
      'api::warehouse.warehouse'
    >;
  };
}

export interface ApiSequenceCounterSequenceCounter
  extends Struct.CollectionTypeSchema {
  collectionName: 'sequence_counters';
  info: {
    displayName: 'Sequence Counter';
    pluralName: 'sequence-counters';
    singularName: 'sequence-counter';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    last_number: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::sequence-counter.sequence-counter'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<
      ['purchase_order', 'sale_order', 'invoice']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSettingSetting extends Struct.CollectionTypeSchema {
  collectionName: 'settings';
  info: {
    displayName: 'Setting';
    pluralName: 'settings';
    singularName: 'setting';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
  };
  attributes: {
    category: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::setting.setting'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    values: Schema.Attribute.JSON;
  };
}

export interface ApiShippingMethodShippingMethod
  extends Struct.CollectionTypeSchema {
  collectionName: 'shipping_methods';
  info: {
    displayName: 'Shipping Method';
    pluralName: 'shipping-methods';
    singularName: 'shipping-method';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::shipping-method.shipping-method'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    options: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    so_shippings: Schema.Attribute.Relation<
      'oneToMany',
      'api::so-shipping.so-shipping'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSoShippingSoShipping extends Struct.CollectionTypeSchema {
  collectionName: 'so_shippings';
  info: {
    displayName: 'SO Shipping';
    pluralName: 'so-shippings';
    singularName: 'so-shipping';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    contact_address: Schema.Attribute.Relation<
      'manyToOne',
      'api::contact-address.contact-address'
    >;
    coupon: Schema.Attribute.Relation<'oneToOne', 'api::coupon.coupon'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date_from: Schema.Attribute.Date;
    date_to: Schema.Attribute.Date;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::so-shipping.so-shipping'
    > &
      Schema.Attribute.Private;
    metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    sale_order: Schema.Attribute.Relation<
      'oneToOne',
      'api::sale-order.sale-order'
    >;
    shipping_amount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    shipping_discount: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    shipping_method: Schema.Attribute.Relation<
      'manyToOne',
      'api::shipping-method.shipping-method'
    >;
    shipping_status: Schema.Attribute.Enumeration<
      ['New', 'In Progress', 'Completed']
    > &
      Schema.Attribute.DefaultTo<'New'>;
    shipping_subtotal: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    transaction_id: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiStateState extends Struct.CollectionTypeSchema {
  collectionName: 'states';
  info: {
    displayName: 'State';
    pluralName: 'states';
    singularName: 'state';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
  };
  attributes: {
    cities: Schema.Attribute.Relation<'oneToMany', 'api::city.city'>;
    code: Schema.Attribute.String & Schema.Attribute.Required;
    country: Schema.Attribute.Relation<'manyToOne', 'api::country.country'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    latitude: Schema.Attribute.Float;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::state.state'> &
      Schema.Attribute.Private;
    longitude: Schema.Attribute.Float;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    timezone: Schema.Attribute.String;
    type: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiStaticPageStaticPage extends Struct.CollectionTypeSchema {
  collectionName: 'static_pages';
  info: {
    displayName: 'Static Page';
    pluralName: 'static-pages';
    singularName: 'static-page';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    content: Schema.Attribute.RichText;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::static-page.static-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSupplierSupplier extends Struct.CollectionTypeSchema {
  collectionName: 'suppliers';
  info: {
    displayName: 'Supplier';
    pluralName: 'suppliers';
    singularName: 'supplier';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    account: Schema.Attribute.Relation<'oneToOne', 'api::account.account'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::supplier.supplier'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    purchase_orders: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-order.purchase-order'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTimelineTimeline extends Struct.CollectionTypeSchema {
  collectionName: 'timelines';
  info: {
    displayName: 'Timeline';
    pluralName: 'timelines';
    singularName: 'timeline';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::timeline.timeline'
    > &
      Schema.Attribute.Private;
    metadata: Schema.Attribute.JSON;
    model: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    record_id: Schema.Attribute.Integer;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiVendorVendor extends Struct.CollectionTypeSchema {
  collectionName: 'vendors';
  info: {
    displayName: 'Vendor';
    pluralName: 'vendors';
    singularName: 'vendor';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.Component<'common.address', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::vendor.vendor'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiWarehouseWarehouse extends Struct.CollectionTypeSchema {
  collectionName: 'warehouses';
  info: {
    displayName: 'Warehouse';
    pluralName: 'warehouses';
    singularName: 'warehouse';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.Component<'common.address', false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    inventories: Schema.Attribute.Relation<
      'oneToMany',
      'api::inventory.inventory'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::warehouse.warehouse'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    purchase_order_details: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-order-detail.purchase-order-detail'
    >;
    sale_order_details: Schema.Attribute.Relation<
      'oneToMany',
      'api::sale-order-detail.sale-order-detail'
    >;
    sale_orders: Schema.Attribute.Relation<
      'oneToMany',
      'api::sale-order.sale-order'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.String;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    accounts: Schema.Attribute.Relation<'oneToMany', 'api::account.account'>;
    audit_logs: Schema.Attribute.Relation<
      'oneToMany',
      'api::audit-log.audit-log'
    >;
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    campaign_actions: Schema.Attribute.Relation<
      'oneToMany',
      'api::campaign-action.campaign-action'
    >;
    campaigns: Schema.Attribute.Relation<'oneToMany', 'api::campaign.campaign'>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    contacts: Schema.Attribute.Relation<'oneToMany', 'api::contact.contact'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    department: Schema.Attribute.Relation<
      'manyToOne',
      'api::department.department'
    >;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    email_templates: Schema.Attribute.Relation<
      'oneToMany',
      'api::email-template.email-template'
    >;
    imports: Schema.Attribute.Relation<'oneToMany', 'api::import.import'>;
    leads: Schema.Attribute.Relation<'oneToMany', 'api::lead.lead'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    mail_histories: Schema.Attribute.Relation<
      'oneToMany',
      'api::mail-history.mail-history'
    >;
    manager: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    members: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    notes: Schema.Attribute.Relation<'oneToMany', 'api::note.note'>;
    opportunities: Schema.Attribute.Relation<
      'oneToMany',
      'api::opportunity.opportunity'
    >;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    product_price_lists: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-price-list.product-price-list'
    >;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    purchase_orders: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchase-order.purchase-order'
    >;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    sale_orders: Schema.Attribute.Relation<
      'oneToMany',
      'api::sale-order.sale-order'
    >;
    settings: Schema.Attribute.Relation<'oneToMany', 'api::setting.setting'>;
    timelines: Schema.Attribute.Relation<'oneToMany', 'api::timeline.timeline'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::session': AdminSession;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::account.account': ApiAccountAccount;
      'api::audit-log.audit-log': ApiAuditLogAuditLog;
      'api::campaign-action.campaign-action': ApiCampaignActionCampaignAction;
      'api::campaign.campaign': ApiCampaignCampaign;
      'api::cart-detail.cart-detail': ApiCartDetailCartDetail;
      'api::cart.cart': ApiCartCart;
      'api::city.city': ApiCityCity;
      'api::contact-address.contact-address': ApiContactAddressContactAddress;
      'api::contact.contact': ApiContactContact;
      'api::country.country': ApiCountryCountry;
      'api::coupon.coupon': ApiCouponCoupon;
      'api::department.department': ApiDepartmentDepartment;
      'api::email-template.email-template': ApiEmailTemplateEmailTemplate;
      'api::global-setting.global-setting': ApiGlobalSettingGlobalSetting;
      'api::home-page.home-page': ApiHomePageHomePage;
      'api::import.import': ApiImportImport;
      'api::inventory-manual-detail.inventory-manual-detail': ApiInventoryManualDetailInventoryManualDetail;
      'api::inventory-manual.inventory-manual': ApiInventoryManualInventoryManual;
      'api::inventory.inventory': ApiInventoryInventory;
      'api::invoice-detail.invoice-detail': ApiInvoiceDetailInvoiceDetail;
      'api::invoice.invoice': ApiInvoiceInvoice;
      'api::lead.lead': ApiLeadLead;
      'api::mail-history.mail-history': ApiMailHistoryMailHistory;
      'api::note.note': ApiNoteNote;
      'api::opportunity.opportunity': ApiOpportunityOpportunity;
      'api::payment-method.payment-method': ApiPaymentMethodPaymentMethod;
      'api::payment.payment': ApiPaymentPayment;
      'api::product-attribute.product-attribute': ApiProductAttributeProductAttribute;
      'api::product-category.product-category': ApiProductCategoryProductCategory;
      'api::product-price-list.product-price-list': ApiProductPriceListProductPriceList;
      'api::product-price.product-price': ApiProductPriceProductPrice;
      'api::product-variant-attribute.product-variant-attribute': ApiProductVariantAttributeProductVariantAttribute;
      'api::product-variant.product-variant': ApiProductVariantProductVariant;
      'api::product.product': ApiProductProduct;
      'api::purchase-order-detail.purchase-order-detail': ApiPurchaseOrderDetailPurchaseOrderDetail;
      'api::purchase-order.purchase-order': ApiPurchaseOrderPurchaseOrder;
      'api::sale-order-detail.sale-order-detail': ApiSaleOrderDetailSaleOrderDetail;
      'api::sale-order.sale-order': ApiSaleOrderSaleOrder;
      'api::sequence-counter.sequence-counter': ApiSequenceCounterSequenceCounter;
      'api::setting.setting': ApiSettingSetting;
      'api::shipping-method.shipping-method': ApiShippingMethodShippingMethod;
      'api::so-shipping.so-shipping': ApiSoShippingSoShipping;
      'api::state.state': ApiStateState;
      'api::static-page.static-page': ApiStaticPageStaticPage;
      'api::supplier.supplier': ApiSupplierSupplier;
      'api::timeline.timeline': ApiTimelineTimeline;
      'api::vendor.vendor': ApiVendorVendor;
      'api::warehouse.warehouse': ApiWarehouseWarehouse;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
