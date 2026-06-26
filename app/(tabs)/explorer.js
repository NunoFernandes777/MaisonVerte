import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { botanicalBackground } from '../../data/plants';

const suggestions = [
  { name: 'Calathea', tag: 'Humidite douce', icon: 'water-outline' },
  { name: 'Sansevieria', tag: 'Tres facile', icon: 'moon-outline' },
  { name: 'Pilea', tag: 'Lumiere indirecte', icon: 'sunny-outline' },
];

export default function ExplorerScreen() {
  return (
    <ImageBackground source={botanicalBackground} resizeMode="cover" style={styles.bg}>
      <View style={styles.veil} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Explorer</Text>
        <Text style={styles.subtitle}>Decouvrez des plantes adaptees a votre interieur.</Text>

        <View style={styles.hero}>
          <Ionicons name="compass-outline" color="#073323" size={34} />
          <Text style={styles.heroTitle}>Suggestions tropicales</Text>
          <Text style={styles.heroText}>Des idees de plantes selon la lumiere, l humidite et la saison actuelle.</Text>
        </View>

        {suggestions.map((plant) => (
          <View key={plant.name} style={styles.card}>
            <View style={styles.iconBubble}>
              <Ionicons name={plant.icon} color="#DDF8C6" size={22} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{plant.name}</Text>
              <Text style={styles.cardMeta}>{plant.tag}</Text>
            </View>
            <Ionicons name="chevron-forward" color="#BDEFA7" size={20} />
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(1,24,15,0.42)' },
  content: { padding: 18, paddingBottom: 112, paddingTop: 54 },
  title: { color: '#F6FFE8', fontSize: 34, fontWeight: '900' },
  subtitle: { color: '#BDEFA7', fontSize: 13, fontWeight: '700', lineHeight: 19, marginTop: 6 },
  hero: {
    backgroundColor: '#DDEBBF',
    borderRadius: 8,
    marginTop: 18,
    padding: 18,
  },
  heroTitle: { color: '#073323', fontSize: 24, fontWeight: '900', marginTop: 12 },
  heroText: { color: 'rgba(7,51,35,0.72)', fontSize: 13, fontWeight: '700', lineHeight: 19, marginTop: 6 },
  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(4,56,35,0.34)',
    borderColor: 'rgba(214,255,190,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    padding: 14,
  },
  iconBubble: {
    alignItems: 'center',
    backgroundColor: 'rgba(135,232,176,0.16)',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  cardText: { flex: 1 },
  cardTitle: { color: '#F6FFE8', fontSize: 17, fontWeight: '900' },
  cardMeta: { color: '#BDEFA7', fontSize: 12, fontWeight: '700', marginTop: 3 },
});
