import { faker } from '@faker-js/faker';
import Strapi from '@strapi/strapi';

// fake data accounts
async function fakeDataAccounts(strapi: any) {
  for (let i = 0; i < 100; i++) {
    await strapi.db.query('api::account.account').create({
      data: {
        name: faker.lorem.sentence(),
        shortName: faker.lorem.sentence(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        fax: faker.phone.number(),
        website: faker.internet.url(),
        description: faker.lorem.paragraph(),
        type: faker.helpers.arrayElement(['Direct', 'Agency']),
        industry: faker.helpers.arrayElement([
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
        ]),
      },
    });
  }

  console.log('Fake data accounts created');
}

// fake data contacts
async function fakeDataContacts(strapi: any) {
  for (let i = 0; i < 100; i++) {
    await strapi.db.query('api::contact.contact').create({
      data: {
        salutation: faker.helpers.arrayElement([
          'Ms.',
          'Mr.',
          'Mrs.',
          'Miss',
          'Dr.',
        ]),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        mobile: faker.phone.number(),
        bod: faker.date.birthdate(),
        jobTitle: faker.person.jobTitle(),
        department: faker.person.jobArea(),
        leadSource: faker.helpers.arrayElement(['Campaign', 'Website']),
      },
    });
  }

  console.log('Fake data contacts created');
}

// fake data opportunities
async function fakeDataOpportunities(strapi: any) {
  for (let i = 0; i < 100; i++) {
    await strapi.db.query('api::opportunity.opportunity').create({
      data: {
        name: faker.lorem.sentence(),
        amount: faker.finance.amount(),
        closeDate: faker.date.future(),
        stage: faker.helpers.arrayElement([
          'Prospecting',
          'Qualification',
          'Proposal',
          'Negotiation',
          'Closed Won',
          'Closed Lost',
        ]),
        probability: faker.finance.amount(),
        nextStep: faker.lorem.sentence(),
        type: faker.helpers.arrayElement(['Exist Business', 'New Business']),
        leadSource: faker.helpers.arrayElement(['Campaign', 'Website']),
        ranking: faker.helpers.arrayElement([1, 2, 3, 4, 5]),
        description: faker.lorem.paragraph(),
      },
    });
  }

  console.log('Fake data opportunities created');
}

// fake data leads
async function fakeDataLeads(strapi: any) {
  for (let i = 0; i < 100; i++) {
    await strapi.db.query('api::lead.lead').create({
      data: {
        salutation: faker.helpers.arrayElement([
          'Ms.',
          'Mr.',
          'Mrs.',
          'Miss',
          'Dr.',
        ]),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        mobile: faker.phone.number(),
        bod: faker.date.birthdate(),
        jobTitle: faker.person.jobTitle(),
        department: faker.person.jobArea(),
        leadSource: faker.helpers.arrayElement(['Campaign', 'Website']),
      },
    });
  }

  console.log('Fake data leads created');
}

// fake data products
async function fakeDataProducts(strapi: any) {
  const productCategories = [];
  const brands = [];
  // product category
  for (let i = 0; i < 10; i++) {
    // category
    const productCategory = await strapi.db
      .query('api::product-category.product-category')
      .create({
        data: {
          name: faker.lorem.sentence({ min: 1, max: 3 }),
        },
      });
    const items = {
      product_category: productCategory.id,
      attributes: [],
    };

    // brand
    const brand = await strapi.db.query('api::brand.brand').create({
      data: {
        name: faker.lorem.sentence({ min: 1, max: 3 }),
      },
    });
    brands.push(brand.id);

    // attributes
    for (let j = 0; j < 2; j++) {
      const attribute = await strapi.db
        .query('api::product-attribute.product-attribute')
        .create({
          data: {
            name: faker.lorem.sentence({ min: 1, max: 3 }),
            metadata: {
              options: [
                {
                  value: 'Option1',
                  label: 'Option1',
                },
                {
                  value: 'Option2',
                  label: 'Option2',
                },
                {
                  value: 'Option3',
                  label: 'Option3',
                },
              ],
            },
            product_category: productCategory.id,
          },
        });
      items.attributes.push(attribute.id);
    }

    productCategories.push(items);
  }

  for (let i = 0; i < 100; i++) {
    const product_category_id =
      faker.helpers.arrayElement(productCategories).product_category;
    // product
    const product = await strapi.db.query('api::product.product').create({
      data: {
        name: faker.lorem.sentence(),
        slug: faker.lorem.slug(),
        unit: faker.helpers.arrayElement(['Box', 'Pallet', 'Carton', 'Piece']),
        summary: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        product_status: faker.helpers.arrayElement(['Active']),
        photos: [
          {
            url: faker.image.url(),
          },
        ],
        product_category: product_category_id,
        brand: faker.helpers.arrayElement(brands),
      },
    });

    // product variants
    for (let j = 0; j < 2; j++) {
      const variant = await strapi.db
        .query('api::product-variant.product-variant')
        .create({
          data: {
            name: faker.lorem.sentence(),
            product: product.id,
            sku: faker.lorem.slug(),
            photos: [
              {
                url: faker.image.url(),
              },
            ],
            variant_status: faker.helpers.arrayElement(['Active']),
            weight: faker.finance.amount(),
            weight_unit: faker.helpers.arrayElement(['kg', 'g', 'lb', 'oz']),
            taxable: faker.datatype.boolean(),
            barcode: faker.lorem.slug(),
            requires_shipping: faker.datatype.boolean(),
          },
        });

      // product variant attributes
      for (let k = 0; k < 2; k++) {
        const productCategoryItem = productCategories.find(
          (item) => item.product_category === product_category_id,
        );
        await strapi.db
          .query('api::product-variant-attribute.product-variant-attribute')
          .create({
            data: {
              product_variant: variant.id,
              product_attribute: faker.helpers.arrayElement(
                productCategoryItem?.attributes || [],
              ),
              attribute_value: faker.helpers.arrayElement([
                'Option1',
                'Option2',
                'Option3',
              ]),
              attribute_status: faker.helpers.arrayElement(['Active']),
            },
          });
      }

      // product variant prices
      await strapi.db.query('api::product-price.product-price').create({
        data: {
          product_variant: variant.id,
          price_type: 'Sale',
          price_status: 'Active',
          price: faker.finance.amount(),
          before_price: faker.finance.amount(),
        },
      });

      // inventory
      await strapi.db.query('api::inventory.inventory').create({
        data: {
          product_variant: variant.id,
          stock_quantity: faker.number.int({ min: 0, max: 100 }),
          warehouse: faker.helpers.arrayElement([1, 2]),
          last_updated: faker.date.recent(),
        },
      });
    }
  }

  console.log('Fake data products created');
}

async function run() {
  const strapi = Strapi.createStrapi({ distDir: './dist' });
  await strapi.load();

  await fakeDataAccounts(strapi);
  await fakeDataContacts(strapi);
  await fakeDataLeads(strapi);
  await fakeDataOpportunities(strapi);
  await fakeDataProducts(strapi);

  process.exit(0);
}

run();
