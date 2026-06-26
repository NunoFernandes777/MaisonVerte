import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { configured, loading, session } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#03140F' }}>
        <ActivityIndicator color="#DDEBBF" />
      </View>
    );
  }

  if (configured && !session) {
    return <Redirect href="/auth" />;
  }

  return <Redirect href="/jardin" />;
}
