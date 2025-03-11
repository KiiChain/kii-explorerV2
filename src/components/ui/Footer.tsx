"use client";

import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import {
  FaXTwitter,
  FaDiscord,
  FaTelegram,
  FaGithub,
  FaMedium,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa6";

export function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaXTwitter size={20} />, href: "https://twitter.com/KiiGlobal" },
    {
      icon: <FaDiscord size={20} />,
      href: "https://discord.com/invite/kiichain",
    },
    { icon: <FaTelegram size={20} />, href: "https://t.me/KiiChainGlobal" },
    { icon: <FaGithub size={20} />, href: "https://github.com/KiiGlobal" },
    { icon: <FaMedium size={20} />, href: "https://kiichain.medium.com" },
    {
      icon: <FaLinkedin size={20} />,
      href: "https://linkedin.com/company/kiiglobal",
    },
    {
      icon: <FaYoutube size={20} />,
      href: "https://www.youtube.com/@kiichain_",
    },
    {
      icon: <FaInstagram size={20} />,
      href: "https://www.instagram.com/kiichainofficial/#",
    },
    {
      icon: <FaFacebook size={20} />,
      href: "https://www.facebook.com/Kiichainglobal/",
    },
  ];

  return (
    <footer
      className="w-full py-8 px-12 flex flex-col items-center gap-6 mt-auto"
      style={{ backgroundColor: theme.boxColor }}
    >
      {/* Íconos de redes sociales */}
      <div className="flex items-center gap-8">
        {socialLinks.map((social, index) => (
          <Link
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
            style={{ color: theme.secondaryTextColor }}
          >
            {social.icon}
          </Link>
        ))}
      </div>

      {/* Links y copyright en una fila */}
      <div className="flex flex-wrap justify-center gap-6 text-base">
        <div style={{ color: theme.secondaryTextColor }}>
          © {currentYear} KiiGlobal
        </div>
        <a
          href="https://kiichain.io/Terms&Conditions"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
          style={{ color: theme.secondaryTextColor }}
        >
          Términos y Condiciones
        </a>
        <a
          href="https://kiichain.io/PrivacyPolicy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
          style={{ color: theme.secondaryTextColor }}
        >
          Política de Privacidad
        </a>
      </div>
    </footer>
  );
}
