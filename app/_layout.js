import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar, setStatusBarHidden } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  useEffect(() => {
    let restoreTimeout;

    async function keepSystemBarsHidden() {
      if (Platform.OS !== 'android') return;
      try {
        await NavigationBar.setBehaviorAsync('overlay-swipe');
        await NavigationBar.setPositionAsync('absolute');
        await NavigationBar.setBackgroundColorAsync('#03140F');
        await NavigationBar.setButtonStyleAsync('light');
        await NavigationBar.setVisibilityAsync('hidden');
        setStatusBarHidden(true, 'fade');
      } catch {
        // Expo Go can ignore this on some Android versions.
      }
    }

    keepSystemBarsHidden();

    const visibilitySubscription = NavigationBar.addVisibilityListener(({ visibility }) => {
      if (visibility !== 'visible') return;
      clearTimeout(restoreTimeout);
      restoreTimeout = setTimeout(keepSystemBarsHidden, 900);
    });

    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        keepSystemBarsHidden();
      }
    });

    return () => {
      clearTimeout(restoreTimeout);
      visibilitySubscription?.remove();
      appStateSubscription?.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
