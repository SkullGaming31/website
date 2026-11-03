"use client";

import { useEffect, useSyncExternalStore } from "react";

type Props = {
  channel: string;
  parent?: string | string[];
  width?: number | string;
  height?: number | string;
};

const PROD_PARENT = "canadiendragon.live";
const WWW_PROD = `www.${PROD_PARENT}`;

const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function sanitizeParent(parent: string) {
  if (!parent) return "";
  let host = parent.replace(/^https?:\/\//i, "").split("/")[0];
  if (host.includes("::")) return "127.0.0.1";
  if (host.includes(":")) host = host.split(":")[0];
  return /^[A-Za-z0-9.-]+$/.test(host) ? host : "";
}

function getClientParents(parent: string | string[] | undefined, runtimeHost: string) {
  const providedParents = Array.isArray(parent) ? parent : parent ? [parent] : [];
  const sanitizedParents = providedParents.map(sanitizeParent).filter(Boolean);
  const parents = Array.from(new Set([...sanitizedParents, runtimeHost].filter(Boolean)));
  const isDevHost = runtimeHost === "localhost" || runtimeHost === "127.0.0.1" || runtimeHost === "::1";

  if (isDevHost) {
    if (!parents.includes("localhost")) parents.push("localhost");
    if (!parents.includes("127.0.0.1")) parents.push("127.0.0.1");
  }

  if (!parents.includes(PROD_PARENT)) parents.push(PROD_PARENT);
  if (!parents.includes(WWW_PROD)) parents.push(WWW_PROD);

  const finalParents = parents.filter((value) => /^[A-Za-z0-9.-]+$/.test(value));
  return {
    finalParents,
    dropped: parents.filter((value) => !finalParents.includes(value)),
  };
}

export default function TwitchPlayer({
  channel,
  parent,
  width = "100%",
  height = 480,
}: Props) {
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  );

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

  const runtimeHost = typeof window === "undefined" ? "" : window.location.hostname;
  const { finalParents: clientParents } = getClientParents(parent, runtimeHost);

  useEffect(() => {
    const { dropped } = getClientParents(parent, runtimeHost);
    if (mounted && dropped.length > 0) {
      console.warn("TwitchPlayer: dropped invalid parent entries:", dropped);
    }
  }, [mounted, parent, runtimeHost]);

  if (!mounted) {
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
