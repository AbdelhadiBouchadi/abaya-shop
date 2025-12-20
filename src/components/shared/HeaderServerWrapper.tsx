import { getMenu } from '@/lib/shopify';
import Header from './Header';

export default async function HeaderServerWrapper() {
  const menu = await getMenu('main-menu');

  return <Header menu={menu} />;
}
