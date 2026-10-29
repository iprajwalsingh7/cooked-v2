import { Suspense } from "react";
import PlatformPage from "../components/PlatformPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="shell">Loading the kitchen…</div>}>
      <PlatformPage platform="github" />
    </Suspense>
  );
}
