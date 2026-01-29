import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  business?: string;
  message?: string;
};

function truncate(str = "", max = 4096) {
  return str.length > max ? str.slice(0, max - 3) + "..." : str;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactPayload;
    const { name, email, business, message } = body || {};

    if (!email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const webhook = process.env.DISCORD_WEBHOOK_URL;

    const embed = {
      title: "New contact form submission",
      fields: [
        { name: "Name", value: name || "(not provided)", inline: true },
        { name: "Email", value: email, inline: true },
        { name: "Type", value: business || "(not provided)", inline: true },
      ],
      description: truncate(message || "", 4096),
      timestamp: new Date().toISOString(),
    };

    if (!webhook) {
      console.log("Contact form received (no webhook configured):", { name, email, business, message });
      return NextResponse.json({ status: "ok", warning: "no webhook configured" });
    }

    const payload = { embeds: [embed] };

    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Discord webhook error", res.status, text);
      return NextResponse.json({ error: "Failed to forward to Discord" }, { status: 500 });
    }

    console.log("Contact forwarded to Discord");
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Contact API error", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
