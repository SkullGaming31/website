"use client";

import { useEffect } from "react";

type Props = {
  channel: string;
  parent?: string | string[];
  width?: number | string;
  height?: number | string;
};

export default function TwitchPlayer({
  channel,
  parent,
  width = "100%",
  height = 480,
}: Props) {
  useEffect(() => {
    // Load Twitch embed script once
    if (!document.getElementById("twitch-embed-script")) {
      const s = document.createElement("script");
      s.setAttribute("id", "twitch-embed-script");
      s.setAttribute("src", "https://embed.twitch.tv/embed/v1.js");
      s.setAttribute("async", "true");
      document.body.appendChild(s);
    }
  }, []);

  // Compute runtime parents. We include the current hostname (window.location.hostname)
  // so the embed works correctly in production and preview deployments. Only include
  // 'localhost' when running on a dev host (e.g. hostname === 'localhost'). If a
  // `parent` prop is provided it will be merged (but we won't force localhost in prod).
  const runtimeHost = typeof window !== "undefined" ? window.location.hostname : "";

  const providedParents = Array.isArray(parent) ? parent : parent ? [parent] : [];

  const isDevHost = runtimeHost === "localhost" || runtimeHost === "127.0.0.1";

  // Always include the runtime host when available. In non-dev environments, ensure the
  // known production/vercel host is included so Twitch will accept the embeddable parent.
  const PROD_PARENT = "website-kappa-ecru-75.vercel.app";

  let parents = Array.from(new Set([...providedParents, runtimeHost].filter(Boolean)));

  if (!isDevHost) {
    // Remove localhost/127 entries if present
    parents = parents.filter((p) => p !== "localhost" && !p.startsWith("127."));
    // Ensure the production hostname is present so embeds on Vercel will be allowed
    if (!parents.includes(PROD_PARENT)) parents.push(PROD_PARENT);
  } else {
    // In dev, keep localhost and runtimeHost as-is
    parents = parents;
  }

  const dataParentAttr = parents.join(",");
  const parentQuery = parents.map((p) => `parent=${encodeURIComponent(p)}`).join("&");

  return (
    <div
      id="twitch-embed"
      className="w-full"
      style={{ width: typeof width === "number" ? `${width}px` : width }}
      data-channel={channel}
      data-parent={dataParentAttr}
    >
      {/* Fallback iframe for environments where the embed script didn't run yet */}
      <iframe
        title={`Twitch stream ${channel}`}
        src={`https://player.twitch.tv/?channel=${encodeURIComponent(channel)}${
          parentQuery ? `&${parentQuery}` : ""
        }&muted=false&autoplay=false`}
        allowFullScreen
        style={{ border: 0 }}
        width={typeof width === "number" ? width : "100%"}
        height={height}
      />
    </div>
  );
}
