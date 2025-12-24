export const getFAQQuery = `
  query getFAQ {
    metaobjects(type: "faq_item", first: 100) {
      nodes {
        question: field(key: "question") { value }
        answer: field(key: "answer") { value }
        category: field(key: "category") { value }
      }
    }
  }
`;
