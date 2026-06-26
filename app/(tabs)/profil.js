import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { botanicalBackground } from '../../data/plants';

const preferences = [
  { label: 'Niveau', value: 'Debutant', icon: 'sparkles-outline' },
  { label: 'Espace', value: 'Appartement', icon: 'home-outline' },
  { label: 'Lumiere', value: 'Indirecte', icon: 'sunny-outline' },
];

export default function ProfilScreen() {
  return (
    <ImageBackground source={botanicalBackground} resizeMode="cover" style={styles.bg}>
      <View style={styles.veil} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" color="#073323" size={34} />
          </View>
          <Text style={styles.title}>Profil</Text>
          <Text style={styles.subtitle}>Preferences pour personnaliser les conseils.</Text>
        </View>

        <View style={styles.panel}>
          {preferences.map((item) => (
            <View key={item.label} style={styles.row}>
              <View style={styles.iconBubble}>
                <Ionicons name={item.icon} color="#DDF8C6" size={21} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.note}>
          <Text style={styles.noteTitle}>Maison Verte</Text>
          <Text style={styles.noteText}>Votre profil aide l app a proposer des plantes et routines plus adaptees.</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(1,24,15,0.42)' },
  content: { padding: 18, paddingBottom: 112, paddingTop: 54 },
  header: { alignItems: 'center' },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#DDEBBF',
    borderRadius: 999,
    height: 82,
    justifyContent: 'center',
    width: 82,
  },
  title: { color: '#F6FFE8', fontSize: 34, fontWeight: '900', marginTop: 14 },
  subtitle: { color: '#BDEFA7', fontSize: 13, fontWeight: '700', lineHeight: 19, marginTop: 5, textAlign: 'center' },
  panel: {
    backgroundColor: 'rgba(4,56,35,0.34)',
    borderColor: 'rgba(214,255,190,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 22,
    padding: 14,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 64,
  },
  iconBubble: {
    alignItems: 'center',
    backgroundColor: 'rgba(135,232,176,0.16)',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  rowText: { flex: 1 },
  rowLabel: { color: '#BDEFA7', fontSize: 12, fontWeight: '800' },
  rowValue: { color: '#F6FFE8', fontSize: 16, fontWeight: '900', marginTop: 2 },
  note: {
    backgroundColor: '#DDEBBF',
    borderRadius: 8,
    marginTop: 16,
    padding: 16,
  },
  noteTitle: { color: '#073323', fontSize: 18, fontWeight: '900' },
  noteText: { color: 'rgba(7,51,35,0.72)', fontSize: 13, fontWeight: '700', lineHeight: 19, marginTop: 6 },
});
