import type { Schema, Struct } from '@strapi/strapi';

export interface ProduitVariant extends Struct.ComponentSchema {
  collectionName: 'components_produit_variants';
  info: {
    displayName: 'Variant';
    icon: 'archive';
  };
  attributes: {
    image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    label: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    stock: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'produit.variant': ProduitVariant;
    }
  }
}
