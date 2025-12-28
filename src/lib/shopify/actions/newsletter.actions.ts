'use server';

type NewsletterState = {
  success: boolean;
  message: string;
};

export async function newsletterAction(
  prevState: NewsletterState,
  formData: FormData
) {
  const email = formData.get('email') as string;

  if (!email) return { success: false, message: 'Email required' };

  try {
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const endpoint = `https://${domain}/api/2024-07/graphql.json`;

    const query = `
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

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token':
          process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query,
        variables: { email },
      }),
      cache: 'no-store',
    });

    const json = await response.json();

    if (json.errors) {
      console.error('System Error:', JSON.stringify(json.errors, null, 2));
      return { success: false, message: 'Erreur technique.' };
    }

    const data = json.data?.customerEmailMarketingSubscribe;

    if (data?.customerUserErrors?.length > 0) {
      return { success: false, message: data.customerUserErrors[0].message };
    }

    return { success: true, message: 'Merci pour votre inscription !' };
  } catch (error) {
    console.error('Network Error:', error);
    return { success: false, message: 'Une erreur est survenue.' };
  }
}
