"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSearch, FiGlobe, FiMap, FiFileText, FiUser, FiLogOut } from "react-icons/fi";
import { PRIMARY_NAV } from "@/lib/site";
import { useAuth } from "@/lib/AuthContext";
import SearchOverlay from "./SearchOverlay";
import styles from "./Header.module.css";

const FEATURED_LINKS = [
  { label: "Country Profiles",        href: "/country-profiles",       Icon: FiGlobe    },
  { label: "Sustainability Roadmaps", href: "/sustainability-roadmaps", Icon: FiMap      },
  { label: "GC8",                     href: "/gc8",                    Icon: FiFileText },
];

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [userMenu,   setUserMenu]   = useState(false);
  const userMenuRef = useRef(null);
  const headerRef   = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
    >
      {/* ── Tier 1: white row ─────────────────────────────────────────── */}
      <div className={styles.topRow}>
        <div className={`container ${styles.topRowInner}`}>
          <Link href="/" className={styles.logo} aria-label="UNAIDS home">
            <img src="/images/UNAIDS_EN.png" alt="UNAIDS" className={styles.logoImg} />
          </Link>

          <nav className={styles.featuredNav} aria-label="Featured sections">
            {FEATURED_LINKS.map(({ label, href, Icon }) => (
              <Link key={href} href={href} className={styles.featuredLink}>
                <Icon className={styles.featuredIcon} aria-hidden="true" />
                <span><strong>{label}</strong></span>
              </Link>
            ))}
          </nav>

          <div className={styles.topActions}>
            <button
              className={styles.searchBtn}
              onClick={() => setSearchOpen(true)}
              aria-label="Search the site"
            >
              <span>Search</span>
              <FiSearch className={styles.searchIcon} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Tier 2: red bar ───────────────────────────────────────────── */}
      <div className={styles.redBar}>
        <div className={`container ${styles.redBarInner}`}>
          <button
            className={styles.burger}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>

          <nav
            className={`${styles.primaryNav} ${mobileOpen ? styles.open : ""}`}
            aria-label="Primary"
          >
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth: show user menu when signed in, sign-in/create when not */}
          <div className={styles.auth}>
            {user ? (
              <div className={styles.userWrap} ref={userMenuRef}>
                <button
                  className={styles.userBtn}
                  onClick={() => setUserMenu((v) => !v)}
                  aria-expanded={userMenu}
                  aria-label="Account menu"
                >
                  <span className={styles.userAvatar}>
                    {initials(user.name)}
                  </span>
                  <span className={styles.userName}>{firstName(user.name)}</span>
                </button>

                {userMenu && (
                  <div className={styles.userDropdown}>
                    <div className={styles.userDropdownInfo}>
                      <span className={styles.userDropdownName}>{user.name}</span>
                      <span className={styles.userDropdownEmail}>{user.email}</span>
                    </div>
                    <div className={styles.userDropdownDivider} />
                    <button className={styles.logoutBtn} onClick={logout}>
                      <FiLogOut size={15} aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/account/signin" className={styles.signIn}>
                  Sign in
                </Link>
                <Link href="/account/create" className={styles.createAccount}>
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
  );
}

function initials(name = "") {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}
function firstName(name = "") {
  return name.split(" ")[0];
}