"use client";

import { useEffect } from "react";

type Props = {
  channel: string;
  parent?: string; // hostname for Twitch embed parent param (defaults to "localhost")
  width?: number | string;
  height?: number | string;
};

export default function TwitchPlayer({
  channel,
  parent = "localhost",
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
      data-parent={parent}
    >
      {/* Fallback iframe for environments where the embed script didn't run yet */}
      <iframe
        title={`Twitch stream ${channel}`}
        src={`https://player.twitch.tv/?channel=${encodeURIComponent(
          channel
        )}&parent=${encodeURIComponent(parent)}&muted=false&autoplay=false`}
        allowFullScreen
        frameBorder={0}
        width={typeof width === "number" ? width : "100%"}
        height={height}
      />
    </div>
  );
}
