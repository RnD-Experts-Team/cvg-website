import Footer from "../components/layouts/Footer";
import Navbar from "../components/layouts/NavBar";
import { getFooterData } from "../lib/footer.service";

export default async function RootGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footerData = await getFooterData();

  return (
    <>
      <Navbar />
      {children}
      <Footer data={footerData} />
    </>
  );
}
