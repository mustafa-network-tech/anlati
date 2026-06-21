import AnlatiV2 from "@/components/AnlatiV2";

export const metadata = {
  title: "ANLATI — Her Hikâyenin Bir Sesi Vardır",
  description:
    "Kendini özgürce anlat. Binlerce insan seni yargılamak için değil, anlamak için burada. Premium sosyal hikâye platformu.",
  keywords: ["hikâye", "anlat", "sosyal platform", "itiraf", "topluluk", "anlati"],
  openGraph: {
    title: "ANLATI — Her Hikâyenin Bir Sesi Vardır",
    description: "Kendini özgürce anlat. Binlerce insan seni anlamak için burada.",
    type: "website",
  },
};

export default function Home() {
  return <AnlatiV2 />;
}
