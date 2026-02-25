import Footer from "../components/layouts/Footer";
import Navbar from "../components/layouts/NavBar";
import { getFooterData } from "../lib/footer.service";
import { getFooter } from "../lib/api/home";

export default async function RootGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Prefer CMS footer when available; fall back to local mock data
  const cmsFooter = await getFooter().catch(() => undefined);
  const footerData = cmsFooter ?? (await getFooterData());

  return (
    <>
      <Navbar />
      {children}
      <Footer data={footerData} />
    </>
  );
}
