import { router, Stack, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";


export default function RootLayout() {
  const { user, token, checkAuth } = useAuthStore();
  const segments = useSegments();

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // first load auth state
    const init = async () => {
      await checkAuth();
      setAppReady(true); // mark app as ready after auth check
    };
    init();
  }, []);

  useEffect(() => {
    if (!appReady) return;

    const isAuthScreen = segments[0] === "(auth)";
    const isAuthenticated = !!user && !!token;

    if (!isAuthenticated && !isAuthScreen) {
      router.replace("/(auth)");
    } else if (isAuthenticated && isAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [appReady, user, token, segments]);

  if (!appReady) {
    // Show loading indicator while checking auth
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeScreen>
    </SafeAreaProvider>
  );
}
