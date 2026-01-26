"use client";

import { useEffect, useState } from "react";

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
  // Mount state: only render the iframe on the client to avoid SSR hydration mismatches
  const [mounted, setMounted] = useState(false);
  const [clientParents, setClientParents] = useState<string[] | null>(null);

  useEffect(() => {
    setMounted(true);
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
  // only on the client so the embed works correctly in production and preview deployments.
  // Avoid adding production parents during server render to prevent hydration mismatches.
  const isServer = typeof window === "undefined";
  const runtimeHost = !isServer ? window.location.hostname : "";

  const providedParents = Array.isArray(parent) ? parent : parent ? [parent] : [];

  // Sanitize parents: strip protocol, paths, and ports; normalize IPv6 localhost to 127.0.0.1
  const sanitizeParent = (p: string) => {
    if (!p) return "";
    // If someone passed a full URL, strip protocol and path
    let host = p.replace(/^https?:\/\//i, "").split("/")[0];
    // If IPv6 localhost (::1) appears, map it to 127.0.0.1 since Twitch rejects ':' in parent
    if (host.includes("::")) return "127.0.0.1";
    // Remove port if present (e.g. localhost:3000)
    if (host.includes(":")) host = host.split(":")[0];
    // Keep only valid hostname characters (letters, numbers, hyphen, dot)
    const valid = /^[A-Za-z0-9.-]+$/;
    return valid.test(host) ? host : "";
  };

  const providedSanitized = providedParents.map(sanitizeParent).filter(Boolean);

  // Prepare client-side parents on mount to avoid SSR/client mismatches
  useEffect(() => {
    if (isServer) return;

    const PROD_PARENT = "canadiendragon.live";
    const WWW_PROD = `www.${PROD_PARENT}`;

    const isDevHost = runtimeHost === "localhost" || runtimeHost === "127.0.0.1" || runtimeHost === "::1";

    const p = Array.from(new Set([...providedSanitized, runtimeHost].filter(Boolean)));

    if (isDevHost) {
      if (!p.includes("localhost")) p.push("localhost");
      if (!p.includes("127.0.0.1")) p.push("127.0.0.1");
      if (!p.includes("::1")) p.push("::1");
    }

    // Always include the production hostnames on the client so embeds work on prod
    if (!p.includes(PROD_PARENT)) p.push(PROD_PARENT);
    if (!p.includes(WWW_PROD)) p.push(WWW_PROD);

    // Validate final parents list and warn about any invalid entries that were dropped
    const finalParents = p.filter((x) => /^[A-Za-z0-9.-]+$/.test(x));
    const dropped = p.filter((x) => !finalParents.includes(x));
    if (dropped.length > 0) console.warn("TwitchPlayer: dropped invalid parent entries:", dropped);

    setClientParents(finalParents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeHost, parent]);

  // If not mounted or clientParents not ready, render a placeholder to avoid SSR mismatch
  if (!mounted || !clientParents) {
    return (
      <div id="twitch-embed" className="w-full bg-black" style={{ width: typeof width === "number" ? `${width}px` : width, height }} data-channel={channel} data-parent="">
        {/* Placeholder while client computes parents and loads the player */}
      </div>
    );
  }

  const dataParentAttr = clientParents.join(",");
  const parentQuery = clientParents.map((p) => `parent=${encodeURIComponent(p)}`).join("&");

  const iframeSrc = `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}${parentQuery ? `&${parentQuery}` : ""}&muted=false&autoplay=false`;

  // Helpful debug output when testing locally — remove in production
  console.debug({
    message: "TwitchPlayer debug",
    runtimeHost,
    protocol: typeof window !== "undefined" ? window.location.protocol : undefined,
    parents: clientParents,
    iframeSrc,
  });

  return (
    <div
      id="twitch-embed"
      className="w-full"
      style={{ width: typeof width === "number" ? `${width}px` : width }}
      data-channel={channel}
      data-parent={dataParentAttr}
    >
      <iframe
        title={`Twitch stream ${channel}`}
        src={iframeSrc}
        allowFullScreen
        style={{ border: 0 }}
        width={typeof width === "number" ? width : "100%"}
        height={height}
      />
    </div>
  );
}
