"use client";

import React, { useEffect, useState } from "react";

interface GatedContentProps {
  wallet: string | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

type AccessState = "loading" | "granted" | "denied" | "no-wallet";

/**
 * Wrap any content that should only be visible to users who either
 * hold the required NFT or have an active Mainlayer subscription.
 */
export function GatedContent({ wallet, children, fallback }: GatedContentProps) {
  const [state, setState] = useState<AccessState>(wallet ? "loading" : "no-wallet");

  useEffect(() => {
    if (!wallet) {
      setState("no-wallet");
      return;
    }

    setState("loading");
    fetch(`/api/access?wallet=${encodeURIComponent(wallet)}`)
      .then((res) => {
        setState(res.ok ? "granted" : "denied");
      })
      .catch(() => setState("denied"));
  }, [wallet]);

  if (state === "loading") {
    return <div aria-live="polite">Checking access…</div>;
  }

  if (state === "granted") {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="gated-fallback">
      <p>
        {state === "no-wallet"
          ? "Connect your wallet to access this content."
          : "Access requires NFT ownership or a Mainlayer subscription."}
      </p>
      <a href="/subscribe">Get access →</a>
    </div>
  );
}
