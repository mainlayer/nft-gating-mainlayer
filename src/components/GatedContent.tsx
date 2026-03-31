"use client";

import React, { useEffect, useState } from "react";

interface GatedContentProps {
  wallet: string | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  planId?: string;
  onGranted?: () => void;
  onDenied?: () => void;
}

type AccessState = "loading" | "granted" | "denied" | "no-wallet" | "error";

interface AccessCheckResult {
  granted: boolean;
  reason?: "nft" | "subscription" | "denied";
  expiresAt?: string;
}

/**
 * Gate content behind NFT ownership or Mainlayer subscription.
 *
 * The component first checks for NFT ownership (free), then falls back
 * to checking for an active Mainlayer subscription (paid).
 *
 * @example
 * <GatedContent wallet={userWallet} planId="pro">
 *   <PremiumDashboard />
 * </GatedContent>
 */
export function GatedContent({
  wallet,
  children,
  fallback,
  planId = "pro",
  onGranted,
  onDenied,
}: GatedContentProps) {
  const [state, setState] = useState<AccessState>(wallet ? "loading" : "no-wallet");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet) {
      setState("no-wallet");
      return;
    }

    setState("loading");
    setError(null);

    // Validate wallet format
    if (!wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      setState("error");
      setError("Invalid wallet address format");
      onDenied?.();
      return;
    }

    const checkAccess = async () => {
      try {
        const res = await fetch(
          `/api/access?wallet=${encodeURIComponent(wallet)}`,
          { method: "GET" }
        );

        const data = (await res.json()) as AccessCheckResult;

        if (res.ok && data.granted) {
          setState("granted");
          onGranted?.();
        } else {
          setState("denied");
          onDenied?.();
        }
      } catch (err) {
        console.error("[GatedContent] Access check error:", err);
        setState("error");
        setError(err instanceof Error ? err.message : "Failed to check access");
        onDenied?.();
      }
    };

    checkAccess();
  }, [wallet, onGranted, onDenied]);

  if (state === "loading") {
    return (
      <div
        className="gated-loading"
        role="status"
        aria-live="polite"
        aria-label="Checking access"
      >
        <p>Verifying access…</p>
      </div>
    );
  }

  if (state === "granted") {
    return <>{children}</>;
  }

  if (state === "error") {
    return (
      <div className="gated-error" role="alert">
        <p>Error checking access: {error}</p>
        <a href="/support">Contact support</a>
      </div>
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="gated-fallback">
      <h2>Access Required</h2>
      <p>
        {state === "no-wallet"
          ? "Connect your wallet to access this premium content."
          : "This content is available to NFT holders or Mainlayer subscribers."}
      </p>
      <a href={`/subscribe?plan=${planId}`} className="cta-button">
        Unlock Access
      </a>
      <p className="fallback-hint">
        Already have access? Try refreshing or reconnecting your wallet.
      </p>
    </div>
  );
}
