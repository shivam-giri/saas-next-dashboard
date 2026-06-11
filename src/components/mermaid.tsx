"use client";

import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  fontFamily: "inherit",
});

export function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    mermaid.render(`mermaid-${Math.random().toString(36).substring(7)}`, chart)
      .then(({ svg }) => {
        setSvg(svg);
      })
      .catch((e) => console.error(e));
  }, [chart]);

  return svg ? (
    <div
      className="flex justify-center my-8 p-6 bg-[#0B0B13] rounded-xl border border-white/5 shadow-inner overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  ) : (
    <div className="flex justify-center my-8 p-6 bg-[#0B0B13] rounded-xl border border-white/5 text-slate-500 animate-pulse">
      Rendering diagram...
    </div>
  );
}
