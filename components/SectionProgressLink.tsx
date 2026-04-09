"use client";

import { useRouter } from "next/navigation";

type Props = {
  sectionOrder: number;
  children: React.ReactNode;
};

export default function SectionProgressLink({ sectionOrder, children }: Props) {
  const router = useRouter();

  function handleClick() {
    sessionStorage.setItem(
      "plan-open-sections",
      JSON.stringify([sectionOrder])
    );
    router.push("/plan");
  }

  return (
    <div onClick={handleClick} className="block cursor-pointer">
      {children}
    </div>
  );
}
