import Footer from "../components/layouts/Footer";
import Navbar from "../components/layouts/NavBar";
import { getFooterData } from "../lib/footer.service";
import { getFooter, getSiteMetadata } from "../lib/api/home";
import { getNavbarData } from "../lib/navbar.service";

export default async function RootGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navbarData, cmsFooter] = await Promise.all([
    getNavbarData().catch(() => undefined),
    getFooter().catch(() => undefined),
  ]);

  const footerData = cmsFooter ?? (await getFooterData());

  return (
    <>
      <Navbar data={navbarData} />
      {children}
      <Footer data={footerData} />
    </>
  );
}
