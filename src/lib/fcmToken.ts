import { getToken, onMessage, type Messaging } from "firebase/messaging";
import { messaging } from "./firebase";
import { registerFcmServiceWorker } from "./fcmServiceWorker";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY?.trim();
const FCM_TOKEN_KEY = "fcm_token";

export async function requestFcmToken(): Promise<string | null> {
  if (!messaging) return null;

  try {
    const registration = await registerFcmServiceWorker();
    if (!registration) return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("FCM permission not granted", { permission });
      return null;
    }

    const token = await getToken(messaging as Messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      localStorage.setItem(FCM_TOKEN_KEY, token);
    }

    return token || null;
  } catch (error) {
    console.warn("FCM token request failed", error);
    return null;
  }
}

export function getStoredFcmToken(): string | null {
  return localStorage.getItem(FCM_TOKEN_KEY);
}

export function clearFcmToken(): void {
  localStorage.removeItem(FCM_TOKEN_KEY);
}

export function onForegroundMessage(
  callback: (payload: {
    title: string;
    body: string;
    data?: Record<string, string>;
  }) => void
): () => void {
  if (!messaging) return () => {};

  const unsubscribe = onMessage(messaging as Messaging, (payload) => {
    callback({
      title: payload.notification?.title ?? "Gasp'Zero",
      body: payload.notification?.body ?? "",
      data: payload.data as Record<string, string> | undefined,
    });
  });

  return unsubscribe;
}

export function watchTokenRefresh(onNewToken: (token: string) => void): () => void {
  if (!messaging) return () => {};
  if (typeof window === "undefined") return () => {};

  let active = true;

  const checkToken = async () => {
    if (!active) return;
    const previous = getStoredFcmToken();
    const next = await requestFcmToken();
    if (next && next !== previous) onNewToken(next);
  };

  const intervalId = window.setInterval(checkToken, 6 * 60 * 60 * 1000);
  const handleFocus = () => {
    void checkToken();
  };
  const handleVisibility = () => {
    if (document.visibilityState === "visible") {
      void checkToken();
    }
  };

  window.addEventListener("focus", handleFocus);
  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    active = false;
    window.clearInterval(intervalId);
    window.removeEventListener("focus", handleFocus);
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}
