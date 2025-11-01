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
  parent = ["localhost", "website-kappa-ecru-75.vercel.app"],
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

  // The Twitch embed expects a div with id and data attributes. We include the `parent` param
  // as a query param on the iframe when the script runs.
  return (
    <div
      id="twitch-embed"
      className="w-full"
      style={{ width: typeof width === "number" ? `${width}px` : width }}
      data-channel={channel}
      data-parent={Array.isArray(parent) ? parent.join(",") : parent}
    >
      {/* Fallback iframe for environments where the embed script didn't run yet */}
      <iframe
        title={`Twitch stream ${channel}`}
        src={`https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&${
          Array.isArray(parent)
            ? parent.map((p) => `parent=${encodeURIComponent(p)}`).join("&")
            : `parent=${encodeURIComponent(parent)}`
        }&muted=false&autoplay=false`}
        allowFullScreen
        style={{ border: 0 }}
        width={typeof width === "number" ? width : "100%"}
        height={height}
      />
    </div>
  );
}
