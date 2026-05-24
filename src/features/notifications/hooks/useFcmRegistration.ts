import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { useRegisterFcmTokenMutation } from "@/gql/graphql";
import { authStorage } from "@/lib/authStorage";
import { getStoredFcmToken, requestFcmToken, watchTokenRefresh } from "@/lib/fcmToken";
import { accessTokenAtom } from "@/store";

export function useFcmRegistration() {
  const [registerToken] = useRegisterFcmTokenMutation();
  const registered = useRef(false);
  const accessToken = useAtomValue(accessTokenAtom);

  useEffect(() => {
    if (registered.current) return;

    const token = accessToken ?? authStorage.getAccessToken();
    if (!token) return;

    const register = async () => {
      const existingToken = getStoredFcmToken();
      const fcmToken = existingToken ?? (await requestFcmToken());

      if (!fcmToken) return;

      try {
        await registerToken({
          variables: {
            fcmToken,
          },
        });
        registered.current = true;
      } catch {
        return;
      }
    };

    register();
  }, [accessToken, registerToken]);

  useEffect(() => {
    const stopWatching = watchTokenRefresh(async (newToken) => {
      try {
        await registerToken({
          variables: {
            fcmToken: newToken,
          },
        });
      } catch {
        return;
      }
    });

    return stopWatching;
  }, [registerToken]);
}
