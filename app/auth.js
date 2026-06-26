import { useState } from 'react';
import { router } from 'expo-router';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { botanicalBackground } from '../data/plants';
import { useAuth } from '../contexts/AuthContext';

export default function AuthScreen() {
  const { configured, error, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const ok = mode === 'login' ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (ok) router.replace('/jardin');
  }

  return (
    <ImageBackground source={botanicalBackground} style={styles.bg} resizeMode="cover">
      <View style={styles.veil} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.authShell}
      >
        <View style={styles.authCard}>
          <Text style={styles.kicker}>Maison Verte</Text>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.copy}>
            Connectez-vous pour sauvegarder vos plantes dans Supabase.
          </Text>

          {!configured ? (
            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>Configuration manquante</Text>
              <Text style={styles.noticeText}>
                Ajoutez EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY dans .env.
              </Text>
              <Pressable style={styles.button} onPress={() => router.replace('/jardin')}>
                <Text style={styles.buttonText}>Voir la demo locale</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#91A786"
                style={styles.input}
                value={email}
              />
              <TextInput
                onChangeText={setPassword}
                placeholder="Mot de passe"
                placeholderTextColor="#91A786"
                secureTextEntry
                style={styles.input}
                value={password}
              />
              {error && <Text style={styles.error}>{error}</Text>}
              <Pressable disabled={busy} onPress={submit} style={styles.button}>
                <Text style={styles.buttonText}>{mode === 'login' ? 'Se connecter' : 'Creer un compte'}</Text>
              </Pressable>
              <Pressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                <Text style={styles.switchText}>
                  {mode === 'login' ? 'Creer un compte' : 'J ai deja un compte'}
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(1,14,10,0.42)' },
  authShell: { flex: 1, justifyContent: 'center', padding: 22 },
  authCard: {
    backgroundColor: 'rgba(3,20,15,0.82)',
    borderColor: 'rgba(221,235,191,0.18)',
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  kicker: { color: '#AFC6A5', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: '#F2EED7', fontSize: 32, fontWeight: '900', marginTop: 6 },
  copy: { color: '#C4D6BA', fontSize: 14, lineHeight: 20, marginBottom: 18, marginTop: 8 },
  input: {
    backgroundColor: 'rgba(221,235,191,0.12)',
    borderColor: 'rgba(221,235,191,0.18)',
    borderRadius: 8,
    borderWidth: 1,
    color: '#F2EED7',
    marginBottom: 10,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDEBBF',
    borderRadius: 8,
    minHeight: 50,
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#09251B', fontSize: 14, fontWeight: '900' },
  error: { color: '#FFD2C8', fontSize: 13, marginBottom: 8 },
  switchText: { color: '#DDEBBF', fontSize: 13, fontWeight: '800', marginTop: 14, textAlign: 'center' },
  notice: { marginTop: 6 },
  noticeTitle: { color: '#F2EED7', fontSize: 18, fontWeight: '900' },
  noticeText: { color: '#C4D6BA', fontSize: 13, lineHeight: 19, marginTop: 8 },
});
