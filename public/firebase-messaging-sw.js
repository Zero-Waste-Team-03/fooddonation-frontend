importScripts("https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js");

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "FIREBASE_CONFIG") {
    const app = firebase.initializeApp(event.data.config);
    const messaging = firebase.messaging(app);

    messaging.onBackgroundMessage((payload) => {
      const title = payload.notification?.title ?? "Gasp'Zero";
      const body = payload.notification?.body ?? "";
      self.registration.showNotification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        data: payload.data,
      });
    });
  }
});
