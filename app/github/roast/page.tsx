import { Suspense } from "react";
import RoastResult from "../../components/RoastResult";

export default function Page() {
  return (
    <Suspense fallback={<div className="shell">Heating things up…</div>}>
      <RoastResult platform="github" />
    </Suspense>
  );
}
