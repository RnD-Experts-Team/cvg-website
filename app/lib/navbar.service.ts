import axios from "axios";
import { NavbarData } from "../components/navbar/navbar.types";
import { ensureHttps } from "./utils/ensure-https";
import { getSiteMetadata } from "./api/home";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function getNavbarData(): Promise<NavbarData> {
  try {
    const [res, siteMetadata] = await Promise.all([
      api.get<NavbarData>("/navbar"),
      getSiteMetadata().catch(() => undefined),
    ]);
    const data = res.data;

    // Use logo from site metadata if available; fall back to navbar response
    const logoFromMetadata = siteMetadata?.logo?.url;
    if (logoFromMetadata) {
      data.logoUrl = ensureHttps(logoFromMetadata);
    } else if (data && typeof data === "object" && "logoUrl" in data && typeof data.logoUrl === "string") {
      data.logoUrl = ensureHttps(data.logoUrl);
    }

    return data;
  } catch {
    return mockNavbarData;
  }
}

/* Temporary Mock */
const mockNavbarData: NavbarData = {
  logoUrl: "/img/logo.png",
  items: [
    { id: 1, label: "Home", link: "/" },
    { id: 2, label: "Our Projects", link: "/projects" },
    { id: 3, label: "Services", link: "/services" },
    // landing-page section links (navigate to home and scroll to id)
    { id: 4, label: "Values", link: "/#value" },
    { id: 5, label: "Process", link: "/#process" },
    { id: 6, label: "About Us", link: "/#about" },
  ],
  contact: {
    label: "Contact Us",
    link: "/#contact",
  },
};
