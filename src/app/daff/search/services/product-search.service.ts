import { Injectable } from '@angular/core';

interface SearchProductsResponse {
  data?: {
    products?: {
      total_count: number;
    };
  };
  errors?: Array<{ message: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class ProductSearchService {
  async searchProducts(searchTerm: string): Promise<number> {
    const response = await fetch('https://mageos-docker.magsite.co.uk/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query SearchProducts($search: String!) {
            products(search: $search) {
              total_count
            }
          }
        `,
        variables: {
          search: searchTerm,
        },
      }),
    });

    const result = (await response.json()) as SearchProductsResponse;

    if (result.errors?.length) {
      throw new Error(result.errors.map((error) => error.message).join(', '));
    }

    const totalCount = result.data?.products?.total_count;

    if (typeof totalCount !== 'number') {
      throw new Error('Invalid product search response.');
    }

    return totalCount;
  }
}
