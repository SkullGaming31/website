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

  const isDevHost =
    !isServer &&
    (runtimeHost === "localhost" || runtimeHost === "127.0.0.1");

  // Always include the runtime host when available. In non-dev environments, ensure the
  // known production/vercel host is included so Twitch will accept the embeddable parent.
  const PROD_PARENT = "canadiendragon.live";

  let parents = Array.from(new Set([...providedSanitized, runtimeHost].filter(Boolean)));

  // Only add production parents on the client — the server render shouldn't assume
  // the runtime hostname (that would cause hydration mismatches once the client
  // renders and computes a different host like 'localhost').
  if (!isDevHost && !isServer) {
    // Remove localhost/127 entries if present
    parents = parents.filter((p) => p !== "localhost" && !p.startsWith("127."));
    // Ensure the production hostname is present so embeds on Vercel will be allowed
    if (!parents.includes(PROD_PARENT)) parents.push(PROD_PARENT);
    // Include the www variant as some visitors use the www host
    const WWW_PROD = `${PROD_PARENT}`;
    if (!parents.includes(WWW_PROD)) parents.push(WWW_PROD);
  } else {
    // In dev, ensure common local hostnames are present for Twitch to allow framing
    if (!parents.includes("localhost")) parents.push("localhost");
    if (!parents.includes("127.0.0.1")) parents.push("127.0.0.1");
  }

  // Validate final parents list and warn about any invalid entries that were dropped
  const finalParents = parents.filter((p) => /^[A-Za-z0-9.-]+$/.test(p));
  const dropped = parents.filter((p) => !finalParents.includes(p));
  if (dropped.length > 0) {
    console.warn("TwitchPlayer: dropped invalid parent entries:", dropped);
  }
  parents = finalParents;

  const dataParentAttr = parents.join(",");
  const parentQuery = parents.map((p) => `parent=${encodeURIComponent(p)}`).join("&");

  if (typeof window !== "undefined") {
    const iframeSrc = `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}${parentQuery ? `&${parentQuery}` : ""}&muted=true&autoplay=false`;
    // Helpful debug output when testing locally — remove in production
    console.debug({
      message: "TwitchPlayer debug",
      runtimeHost,
      protocol: window.location.protocol,
      parents,
      iframeSrc,
    });
    // Warn when not using HTTPS on non-local hosts
    if (window.location.protocol !== "https:" && !isDevHost) {
      console.warn("Twitch embeds require HTTPS for non-localhost hosts. The current protocol is:", window.location.protocol);
    }
  }

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
        src={`https://player.twitch.tv/?channel=${encodeURIComponent(channel)}${parentQuery ? `&${parentQuery}` : ""
          }&muted=false&autoplay=false`}
        allowFullScreen
        style={{ border: 0 }}
        width={typeof width === "number" ? width : "100%"}
        height={height}
      />
    </div>
  );
}
