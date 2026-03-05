
import { blogPosts } from '@/lib/data';
import { Post } from './types';
import { PlaceHolderImages } from './placeholder-images';

const STRAPI_API_URL = process.env.STRAPI_API_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function fetchStrapi(route: string) {
  const url = `${STRAPI_API_URL}${route}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: 'no-store', // Fetch fresh data on each request
    });

    if (!response.ok) {
      console.error('Failed to fetch from Strapi:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    return null;
  }
}

function mapStrapiToPost(strapiPost: any): Post {
  const cover = strapiPost.attributes.cover?.data;
  const imageUrl = cover ? `${process.env.STRAPI_API_URL}${cover.attributes.url}` : PlaceHolderImages.find(p => p.id === 'blog-react-hooks')?.imageUrl || '';

  return {
    title: strapiPost.attributes.title,
    description: strapiPost.attributes.description,
    url: `/blog/${strapiPost.attributes.slug}`,
    imageUrl: imageUrl,
    imageHint: cover ? 'strapi blog post' : 'default blog image',
  };
}


export async function getBlogPosts(): Promise<Post[]> {
  if (!STRAPI_API_URL || !STRAPI_API_TOKEN) {
    console.warn('Strapi API URL or Token is not set. Falling back to local data.');
    // Fallback to local data
    return blogPosts.map(post => {
      const image = PlaceHolderImages.find(p => p.imageHint === post.imageHint);
      return {
        ...post,
        imageUrl: image?.imageUrl || '',
      };
    });
  }

  const strapiData = await fetchStrapi('/api/blogs?populate=*');

  if (strapiData && Array.isArray(strapiData) && strapiData.length > 0) {
    return strapiData.map(mapStrapiToPost);
  }

  // Fallback to local data if Strapi fetch fails or returns no posts
  return blogPosts.map(post => {
    const image = PlaceHolderImages.find(p => p.imageHint === post.imageHint);
    return {
      ...post,
      imageUrl: image?.imageUrl || '',
    };
  });
}
