'use server';

export async function newsletterAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, message: 'Veuillez entrer une adresse email.' };
  }

  try {
    // 1. Admin API Endpoint (Note the /admin/api/ part)
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const endpoint = `https://${domain}/admin/api/2025-10/graphql.json`;

    // 2. Admin Mutation: Create a customer with marketing consent directly
    const adminMutation = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            emailMarketingConsent {
              marketingState
            }
          }
          userErrors {
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

        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query: adminMutation,
        variables: {
          input: {
            email: email,
            emailMarketingConsent: {
              marketingState: 'SUBSCRIBED',
              marketingOptInLevel: 'SINGLE_OPT_IN',
            },
            tags: ['newsletter-subscriber'],
          },
        },
      }),
      cache: 'no-store',
    });

    const json = await response.json();

    if (json.errors) {
      console.error('System Error:', json.errors);
      return { success: false, message: 'Erreur technique.' };
    }

    const data = json.data?.customerCreate;

    if (data?.userErrors?.length > 0) {
      const msg = data.userErrors[0].message;

      if (msg.toLowerCase().includes('taken')) {
        return { success: true, message: 'Vous êtes déjà inscrit !' };
      }
      return { success: false, message: msg };
    }

    return { success: true, message: 'Merci pour votre inscription !' };
  } catch (error) {
    console.error('Network Error:', error);
    return { success: false, message: 'Une erreur est survenue.' };
  }
}
