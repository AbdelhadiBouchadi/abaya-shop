import { getMenu } from '@/lib/shopify';
import { Menu } from '@/lib/shopify/types';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import {
  FaFacebook,
  FaInstagram,
  FaArrowRight,
  FaTiktok,
} from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const contactInfo = [
  {
    icon: <MdEmail />,
    text: 'contact@waliliya.com',
    href: 'mailto:contact@waliliya.com',
  },
  {
    icon: <MdPhone />,
    text: '+212-666666666',
    href: 'tel:+212666666666',
  },
  {
    icon: <MdLocationOn />,
    text: (
      <>
        El Bassatine
        <br /> 50000 Meknès
      </>
    ),
    href: null,
  },
];

const socialIcons = [
  { icon: <FaFacebook />, label: 'Facebook', href: '#' },
  { icon: <FaInstagram />, label: 'Instagram', href: '#' },
  { icon: <FaTiktok />, label: 'Tiktok', href: '#' },
];

export default async function Footer() {
  const [footerLinksMenu, footerCategoriesMenu] = await Promise.all([
    getMenu('customer-account-main-menu'),
    getMenu('footer'),
  ]);

  // Shared header style to match the reference photo (uppercase, tracking)
  const headerClass =
    'font-title font-semibold text-sm mb-6 text-[#3E2723] uppercase tracking-wider';

  return (
    <footer className="bg-[#9d5035]/30 text-gray-800 font-text border-t border-[#b88d6a]/20">
      {/* Top Section: 4 Columns Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-start">
        {/* Column 1: Collections (was Categories in photo) */}
        <div>
          <h3 className={headerClass}>Collections</h3>
          <ul className="space-y-3 text-sm">
            {footerCategoriesMenu.length > 0 ? (
              footerCategoriesMenu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    className="hover:text-[#9d5035] hover:underline transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">Menu is empty</li>
            )}
          </ul>
        </div>

        {/* Column 2: Liens Utiles */}
        <div>
          <h3 className={headerClass}>Liens Utiles</h3>
          <ul className="space-y-3 text-sm">
            {footerLinksMenu.length > 0 ? (
              footerLinksMenu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    className="hover:text-[#9d5035] hover:underline transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">Menu is empty</li>
            )}
          </ul>
        </div>

        {/* Column 3: Contact & Suivez-nous (Combined to fit layout) */}
        <div>
          <h3 className={headerClass}>Contact & Suivez-nous</h3>
          {/* Social Icons */}
          <div className="flex gap-4 mb-6">
            {socialIcons.map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="text-xl text-[#3E2723] hover:text-[#9d5035] hover:scale-110 transition-all duration-300"
                title={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
          </div>
          {/* Contact Details */}
          <ul className="space-y-3 text-sm">
            {contactInfo.map((item, index) => (
              <li key={index} className="flex gap-3 items-start">
                <span className="text-lg mt-0.5 text-[#9d5035]">
                  {item.icon}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    className="hover:text-[#9d5035] transition-colors"
                  >
                    {item.text}
                  </a>
                ) : (
                  <span>{item.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h3 className={headerClass}>
            Recevez promotions exclusives, ventes privées et nouveautés
          </h3>
          <form className="flex flex-col gap-3 mt-2">
            <input
              type="email"
              placeholder="Votre email"
              className="w-full px-4 py-3 text-sm rounded-md border border-[#b88d6a]/40 bg-white/50 focus:outline-none focus:border-[#9d5035] focus:ring-1 focus:ring-[#9d5035] placeholder:text-gray-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#3E2723] text-white font-semibold py-3 px-4 rounded-md hover:bg-[#9d5035] transition-colors duration-300 flex items-center justify-center gap-2 uppercase text-sm tracking-wider"
            >
              M&apos;inscrire
              <FaArrowRight className="text-xs" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section: Logo Left, Copyright Right */}
      <div className="py-8 px-6 border-t border-[#b88d6a]/20 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Side: Logo */}
        <div className="shrink-0">
          <Link href="/">
            <Image
              src="/logo.jpg"
              alt="Waliliya Logo"
              width={70}
              height={70}
              className="rounded-xl object-contain"
            />
          </Link>
        </div>

        {/* Right Side: Copyright & Links */}
        <div className="text-sm text-center md:text-right flex flex-col md:items-end gap-2">
          <p>
            Copyright &copy; {new Date().getFullYear()}{' '}
            <strong className="uppercase font-title tracking-wide text-[#3E2723]">
              Waliliya
            </strong>
            . Tous droits réservés.
          </p>
          <div className="text-xs text-gray-500 flex justify-center md:justify-end gap-4">
            <Link
              href="/policies/terms-of-service"
              className="hover:text-[#9d5035]"
            >
              Conditions Générales
            </Link>
            <span>|</span>
            <Link
              href="/policies/privacy-policy"
              className="hover:text-[#9d5035]"
            >
              Politique de Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
