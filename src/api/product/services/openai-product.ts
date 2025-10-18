import { ProductFormType } from '../types/openapi.product';

export default () => ({
  async normalizeProduct(product: ProductFormType) {
    return {
      product: {
        name: product.name,
        summary: product.summary,
        description: product.description,
        slug: product.slug,
        product_status: product.status || 'Active',
        unit: 'Unit',
        photos: product.photos || [],
        // Note: product_category is a relation; resolve and attach in controller if needed
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
        // product relation is set after product creation
      })),
      product_attributes: (product.options || []).map((opt) => ({
        name: opt.name,
        // description is optional; omit or set from metadata if you prefer
        weight: typeof opt.position === 'number' ? opt.position : 0,
        metadata: { values: opt.values || [] },
        // product_category relation can be attached later if required
      })),
      product_prices: (product.variants || []).map((variant) => ({
        price_type: 'Sale',
        before_price: null,
        price: variant.price ?? 0,
        price_status: 'Active',
        // product_variant relation should be linked after variant creation
      })),
    };
  },
});
