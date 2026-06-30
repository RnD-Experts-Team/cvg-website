import { FooterData } from "../components/footer/footer.types";

export async function getFooterData(): Promise<FooterData> {
  // 🔁 Replace with real API later
  return {
    brand: {
      logoUrl: "/img/blacklogo.png",
      title: "Commercial Vision Group",
      copyright: "© 2026 CVG Construction All rights reserved."
    },
    socialMedia: [
      {
        id: "1",
        platform: "instagram",
        iconUrl: "/img/insta.png",
        link: "#"
      },
      {
        id: "2",
        platform: "linkedin",
        iconUrl: "/img/in.png",
        link: "#"
      },{
        id: "3",
        platform: "youtube",
        iconUrl: "/img/youtube.png",
        link: "#"
      },{
        id: "4",
        platform: "facebook",
        iconUrl: "/img/facebook.png",
        link: "#"
      }
    ],
    contact: [
        {
            text: "Call",
            phone: "444 999 2225",
        },
        {
            text: "Email",
            email: "contact@cvg.com"
        }
    ]
  };
}
// await fetch(`${process.env.NEXT_PUBLIC_API_URL}/footer`)
