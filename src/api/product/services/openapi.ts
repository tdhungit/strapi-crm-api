import { NormalizeDataType, ProductFormType } from '../types/openapi';

export default () => ({
  async normalizeProduct(product: ProductFormType): Promise<NormalizeDataType> {
    return {
      vendor: {
        name: product.vendor,
      },
      product_category: {
        name: product.product_category,
      },
      product: {
        name: product.name,
        summary: product.summary,
        description: product.description,
        slug: product.slug,
        product_status: product.status || 'Active',
        unit: 'Unit',
        photos: product.photos || [],
      },
      product_variants: (product.variants || []).map((variant) => ({
        name: variant.name,
        sku: variant.sku,
        photos: variant.photos || [],
        variant_status: 'Active',
        taxable: typeof variant.taxable === 'boolean' ? variant.taxable : true,
        barcode: variant.barcode,
        weight: variant.weight,
        weight_unit: variant.weight_unit,
        requires_shipping:
          typeof variant.requires_shipping === 'boolean'
            ? variant.requires_shipping
            : true,
        variant_options: variant.options || [],
      })),
      product_attributes: (product.options || []).map((opt) => ({
        name: opt.name,
        weight: typeof opt.position === 'number' ? opt.position : 0,
        metadata: {
          options:
            opt.values?.length > 0
              ? opt.values.map((value) => ({ value }))
              : [],
        },
      })),
      product_prices: (product.variants || []).map((variant) => ({
        price_type: 'Sale',
        before_price: null,
        price: variant.price ?? 0,
        price_status: 'Active',
      })),
    };
  },
});
