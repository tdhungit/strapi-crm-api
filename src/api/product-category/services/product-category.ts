import { factories } from '@strapi/strapi';

export type CategoryType = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  weight: number;
  parent: { id: number } | null;
};

export type CategoryNodeType = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  weight: number;
  parent: number | null;
  children: CategoryNodeType[];
};

export default factories.createCoreService(
  'api::product-category.product-category',
  ({ strapi }) => ({
    async getTreeProductCategories() {
      // Fetch all categories with minimal fields including parent relation
      const categories = (await strapi.entityService.findMany(
        'api::product-category.product-category',
        {
          populate: { parent: { fields: ['id'] } },
          sort: { weight: 'asc' },
          limit: -1,
        },
      )) as unknown as CategoryType[];

      // Normalize and prepare nodes with children array
      const nodes: CategoryNodeType[] = categories.map((c) => ({
        id: c.id,
        documentId: c.documentId,
        name: c.name,
        slug: c.slug,
        description: c.description,
        weight: typeof c.weight === 'number' ? c.weight : 0,
        parent: c.parent ? c.parent.id : null,
        children: [],
      }));

      // Index by id for quick lookup
      const byId = new Map<number, CategoryNodeType>();
      for (const n of nodes) byId.set(n.id, n);

      // Link children to their parent
      for (const n of nodes) {
        if (n.parent != null) {
          const p = byId.get(n.parent);
          if (p) p.children.push(n);
        }
      }

      // Roots are nodes with no parent
      const roots = nodes.filter((n) => n.parent == null);

      // Optional: sort children by weight then name for deterministic order
      const sortNodes = (arr: CategoryNodeType[]) => {
        arr.sort((a, b) => a.weight - b.weight || a.name.localeCompare(b.name));
        for (const n of arr) sortNodes(n.children);
      };
      sortNodes(roots);

      return roots;
    },
  }),
);
