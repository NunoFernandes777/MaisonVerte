import { useCallback, useEffect, useMemo, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { botanicalBackground } from '../../data/plants';

const seasonContent = {
  printemps: {
    title: 'Printemps',
    icon: 'flower-outline',
    tone: '#BFE7A5',
    advice: [
      'Reprenez les arrosages progressivement.',
      'Rempotez les plantes qui manquent d espace.',
      'Tournez les pots vers la lumiere douce.',
    ],
    plants: ['Basilic', 'Pilea', 'Monstera', 'Menthe'],
  },
  ete: {
    title: 'Ete',
    icon: 'sunny-outline',
    tone: '#F4D778',
    advice: [
      'Arrosez plus souvent, surtout le matin.',
      'Protegez les feuilles du soleil direct.',
      'Augmentez l humidite des plantes tropicales.',
    ],
    plants: ['Basilic', 'Aloe Vera', 'Pothos', 'Ficus'],
  },
  automne: {
    title: 'Automne',
    icon: 'leaf-outline',
    tone: '#E2AE76',
    advice: [
      'Reduisez legerement l arrosage.',
      'Nettoyez les feuilles pour capter plus de lumiere.',
      'Eloignez les plantes des nuits fraiches.',
    ],
    plants: ['Ficus', 'Pothos', 'Sansevieria', 'Calathea'],
  },
  hiver: {
    title: 'Hiver',
    icon: 'snow-outline',
    tone: '#B7D9D2',
    advice: [
      'Arrosez moins, le terreau seche plus lentement.',
      'Evitez les courants d air froids.',
      'Gardez les plantes proches d une lumiere douce.',
    ],
    plants: ['Pothos', 'Ficus', 'Zamioculcas', 'Sansevieria'],
  },
};

export default function JardinScreen() {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('Meteo locale');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const season = useMemo(() => getSeason(new Date()), []);
  const seasonInfo = seasonContent[season];

  const loadWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatus('Recherche de la position...');

    try {
      const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
      if (permissionStatus !== 'granted') {
        setWeather(null);
        setStatus('Position non autorisee');
        setError('Autorisez la localisation pour afficher la meteo de vos plantes.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = position.coords;

      setStatus('Meteo des plantes');
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
      );
      const data = await response.json();
      const current = data.current;

      setWeather({
        temperature: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        wind: Math.round(current.wind_speed_10m),
        code: current.weather_code,
      });
      setStatus('Meteo des plantes');
    } catch {
      setError('Impossible de charger la meteo pour le moment.');
      setStatus('Meteo indisponible');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  const climateCards = [
    { label: 'Humidite', icon: 'water-outline', value: weather ? `${weather.humidity}%` : '--' },
    { label: 'Vent', icon: 'navigate-outline', value: weather ? `${weather.wind} km/h` : '--' },
  ];

  return (
    <ImageBackground source={botanicalBackground} resizeMode="cover" style={styles.bg}>
      <View style={styles.veil} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View />
          <Pressable onPress={loadWeather} style={styles.roundButton}>
            <Ionicons name="refresh" color="#E9FFD8" size={18} />
          </Pressable>
        </View>

        <View style={styles.weatherHero}>
          <View style={styles.cloudCluster}>
            <Ionicons name={weatherIcon(weather?.code)} color="#DDF8C6" size={74} />
          </View>
          <Text style={styles.temperature}>{weather ? `${weather.temperature} deg` : '-- deg'}</Text>
          <Text style={styles.summary}>
            {weather ? weatherDescription(weather.code) : loading ? 'Localisation en cours' : 'Aucune donnee'}
          </Text>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.climateRail}>
          {climateCards.map((card) => (
            <View key={card.label} style={styles.climateCard}>
              <Text style={styles.climateLabel}>{card.label}</Text>
              <Ionicons name={card.icon} color="#87E8B0" size={20} />
              <Text style={styles.climateValue}>{card.value}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.featureCard, { borderColor: seasonInfo.tone }]}>
          <View>
            <Text style={styles.cardPlace}>Saison actuelle</Text>
            <Text style={styles.cardTemp}>{seasonInfo.title}</Text>
            <Text style={styles.cardMeta}>Conseils pour vos plantes</Text>
          </View>
          <View style={[styles.cardIcon, { backgroundColor: seasonInfo.tone }]}>
            <Ionicons name={seasonInfo.icon} color="#073323" size={34} />
          </View>
        </View>

        <View style={styles.tipStack}>
          {seasonInfo.advice.map((item, index) => (
            <View key={item} style={styles.tipCard}>
              <Text style={styles.tipNumber}>0{index + 1}</Text>
              <Text style={styles.tipText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plantsPanel}>
          <Text style={styles.panelTitle}>Plantes conseillees</Text>
          <View style={styles.chips}>
            {seasonInfo.plants.map((plant) => (
              <View key={plant} style={styles.chip}>
                <Text style={styles.chipText}>{plant}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function getSeason(date) {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'printemps';
  if (month >= 6 && month <= 8) return 'ete';
  if (month >= 9 && month <= 11) return 'automne';
  return 'hiver';
}

function weatherIcon(code) {
  if (code == null) return 'partly-sunny-outline';
  if (code === 0) return 'sunny-outline';
  if ([1, 2, 3].includes(code)) return 'partly-sunny-outline';
  if ([45, 48].includes(code)) return 'cloud-outline';
  if (code >= 51 && code <= 67) return 'rainy-outline';
  if (code >= 71 && code <= 77) return 'snow-outline';
  if (code >= 80 && code <= 99) return 'thunderstorm-outline';
  return 'cloudy-outline';
}

function weatherDescription(code) {
  if (code == null) return 'Meteo locale';
  if (code === 0) return 'Ciel clair';
  if ([1, 2, 3].includes(code)) return 'Nuages legers';
  if ([45, 48].includes(code)) return 'Brouillard';
  if (code >= 51 && code <= 67) return 'Pluie fine';
  if (code >= 71 && code <= 77) return 'Neige';
  if (code >= 80 && code <= 99) return 'Averses';
  return 'Temps couvert';
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(1,24,15,0.42)' },
  content: { padding: 18, paddingBottom: 112, paddingTop: 34 },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(4,56,35,0.54)',
    borderColor: 'rgba(214,255,190,0.18)',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  weatherHero: {
    alignItems: 'center',
    backgroundColor: 'rgba(7,70,45,0.04)',
    borderColor: 'rgba(209,255,184,0.06)',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 22,
    minHeight: 280,
    overflow: 'hidden',
    padding: 10,
  },
  cloudCluster: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    height: 98,
    justifyContent: 'center',
    marginTop: 10,
    width: 120,
  },
  temperature: {
    color: '#F6FFE8',
    fontFamily: 'sans-serif-thin',
    fontSize: 84,
    fontWeight: '200',
    lineHeight: 90,
    marginTop: 8,
  },
  summary: { color: '#DDF8C6', fontSize: 14, fontWeight: '700' },
  error: { color: '#FFE5D1', fontSize: 12, fontWeight: '800', lineHeight: 18, marginTop: 10, textAlign: 'center' },
  climateRail: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 14,
  },
  climateCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(4,56,35,0.28)',
    borderColor: 'rgba(214,255,190,0.1)',
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 7,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  climateLabel: { color: '#BDEFA7', fontSize: 10, fontWeight: '800' },
  climateValue: { color: '#F6FFE8', fontSize: 12, fontWeight: '900', textAlign: 'center' },
  featureCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(8,83,53,0.36)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    minHeight: 126,
    padding: 18,
  },
  cardPlace: { color: '#BDEFA7', fontSize: 12, fontWeight: '800' },
  cardTemp: { color: '#F6FFE8', fontSize: 36, fontWeight: '900', marginTop: 4 },
  cardMeta: { color: '#DDF8C6', fontSize: 12, fontWeight: '800', marginTop: 4 },
  cardIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  tipStack: { gap: 10, marginTop: 14 },
  tipCard: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(4,56,35,0.28)',
    borderColor: 'rgba(214,255,190,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  tipNumber: { color: '#87E8B0', fontSize: 15, fontWeight: '900' },
  tipText: { color: '#DDF8C6', flex: 1, fontSize: 13, fontWeight: '700', lineHeight: 19 },
  plantsPanel: {
    backgroundColor: 'rgba(4,56,35,0.28)',
    borderColor: 'rgba(214,255,190,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  panelTitle: { color: '#F6FFE8', fontSize: 18, fontWeight: '900' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    backgroundColor: 'rgba(135,232,176,0.16)',
    borderColor: 'rgba(214,255,190,0.22)',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chipText: { color: '#DDF8C6', fontSize: 12, fontWeight: '900' },
});
