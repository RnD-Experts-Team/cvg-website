import { getValuesSection } from "@/app/lib/api/home";
import ValuesClient from "./ValuesClient";

export default async function ValuesSection() {
  const valuesSection = await getValuesSection().catch(() => undefined);
  const title = valuesSection?.title ?? "Our Values";
  const values = valuesSection?.values ?? [];

  return <ValuesClient title={title} values={values} />;
}
