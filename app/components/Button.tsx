import React from "react";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline";
  external?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Button({
  children,
  className = "",
  variant = "primary",
  external = false,
  ...rest
}: BaseProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform";

  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md px-4 py-2 hover:from-purple-700 hover:to-purple-600 focus:ring-purple-300",
    outline:
      "bg-transparent border border-purple-600 text-purple-100 px-4 py-2 hover:bg-white/5 focus:ring-purple-300",
  };

  const classes = `${base} ${variants[variant]} ${className}`.trim();

  // If href provided in rest props, render an anchor
  const href = (rest as React.AnchorHTMLAttributes<HTMLAnchorElement>).href as string | undefined;

  if (href) {
    const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
      ...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>),
    };
    if (external) {
      anchorProps.target = anchorProps.target ?? "_blank";
      anchorProps.rel = anchorProps.rel ?? "noopener noreferrer";
    }

    return (
      <a {...anchorProps} className={classes} href={href}>
        {children}
      </a>
    );
  }

  // Fallback to native button
  return (
    <button {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
      {children}
    </button>
  );
}
