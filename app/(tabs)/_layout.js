import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { PlantsProvider } from '../../contexts/PlantsContext';
import { useAuth } from '../../contexts/AuthContext';

export default function TabsLayout() {
  const { configured, loading, session } = useAuth();

  if (!loading && configured && !session) {
    return <Redirect href="/auth" />;
  }

  return (
    <PlantsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#073323',
          tabBarInactiveTintColor: '#16251E',
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#F8FAF3',
            borderColor: 'rgba(7,51,35,0.08)',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTopWidth: 0,
            bottom: 0,
            elevation: 18,
            height: 60,
            left: 0,
            paddingBottom: 0,
            paddingTop: 0,
            position: 'absolute',
            right: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.22,
            shadowRadius: 18,
          },
          tabBarItemStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 60,
            paddingTop: 0,
          },
        }}
      >
        <Tabs.Screen
          name="jardin"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon color={color} focused={focused} name={focused ? 'home' : 'home-outline'} />
            ),
          }}
        />
        <Tabs.Screen
          name="eau"
          options={{
            title: 'Mes plantes',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon color={color} focused={focused} name={focused ? 'leaf' : 'leaf-outline'} />
            ),
          }}
        />
        <Tabs.Screen
          name="explorer"
          options={{
            title: 'Explorer',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon color={color} focused={focused} name={focused ? 'compass' : 'compass-outline'} />
            ),
          }}
        />
        <Tabs.Screen
          name="profil"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon color={color} focused={focused} name={focused ? 'person' : 'person-outline'} />
            ),
          }}
        />
        <Tabs.Screen
          name="plante/[id]"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
      </Tabs>
    </PlantsProvider>
  );
}

function TabIcon({ color, focused, name }) {
  return (
    <View
      style={{
        alignItems: 'center',
        height: 60,
        justifyContent: 'center',
        transform: [{ translateY: focused ? -18 : 9 }],
        width: 58,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: focused ? '#DDEBBF' : 'transparent',
          borderColor: focused ? '#F8FAF3' : 'transparent',
          borderRadius: 999,
          borderWidth: focused ? 6 : 0,
          height: focused ? 56 : 32,
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: focused ? 0.18 : 0,
          shadowRadius: 12,
          width: focused ? 56 : 32,
        }}
      >
        <Ionicons name={name} color={color} size={focused ? 27 : 23} />
      </View>
    </View>
  );
}
