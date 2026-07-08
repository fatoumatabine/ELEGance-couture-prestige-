"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "eleganceVisitorId";

function createVisitorId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function getVisitorId() {
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const visitorId = createVisitorId();
  window.localStorage.setItem(STORAGE_KEY, visitorId);
  return visitorId;
}

function getScreenLabel() {
  if (!window.screen) return "";
  return `${window.screen.width}x${window.screen.height}`;
}

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const payload = JSON.stringify({
      visitorId: getVisitorId(),
      path: `${window.location.pathname}${window.location.search}`,
      title: document.title,
      referrer: document.referrer,
      language: navigator.language,
      screen: getScreenLabel(),
    });

    if ("sendBeacon" in navigator) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/visitors", blob);
      return;
    }

    const controller = new AbortController();
    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
      signal: controller.signal,
    }).catch(() => null);

    return () => controller.abort();
  }, [pathname]);

  return null;
}
