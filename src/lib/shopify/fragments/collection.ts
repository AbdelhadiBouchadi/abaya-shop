import imageFragment from './image';
import seoFragment from './seo';

export const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    seo {
      ...seo
    }
    image {
      ...image
    }
    updatedAt
  }
  ${seoFragment}
  ${imageFragment}
`;
