export const customerSubscribeMutation = `
  mutation customerSubscribe($email: String!) {
    customerEmailMarketingSubscribe(email: $email) {
      customer {
        email
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;
