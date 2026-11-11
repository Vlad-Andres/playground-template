import { staticSite } from "@site/content/static";
import { HomeScreen } from "@site/screens/HomeScreen";

export default function HomePage() {
  return <HomeScreen data={staticSite} />;
}
