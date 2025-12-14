import Image from 'next/image';
import Link from 'next/link';
import DesktopNav from './DesktopNav';
import Search from './Search';
import MobileMenu from './MobileMenu';
import CartButton from './CartButton';

export default function Header() {
  return (
    <header className="container mx-auto p-6 flex items-center justify-between w-full relative">
      <MobileMenu />

      <div className="flex items-center gap-1 text-xl font-semibold">
        <Link href="/">
          <Image src="/Logo.png" alt="logo" width={200} height={100} />
        </Link>
      </div>

      {/* Desktop Navbar */}
      <DesktopNav />

      <div className="hidden justify-center xl:flex xl:w-1/3 ">
        <Search />
      </div>

      {/* Cart Button  */}
      <div className="flex items-center">
        <CartButton />
      </div>
    </header>
  );
}
