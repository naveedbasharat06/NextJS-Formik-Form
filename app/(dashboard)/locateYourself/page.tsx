"use client";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("../../components/map"), {
  ssr: false, // Disable server-side rendering for this component
});

export default function LocateYourself() {
  return (
    <div>
      <Map />
    </div>
  );
}
