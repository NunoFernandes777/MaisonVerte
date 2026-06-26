import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const plantImages = {
  monstera: require('./assets/plants/monstera.png'),
  ficus: require('./assets/plants/ficus.png'),
  basilic: require('./assets/plants/basilic.png'),
  pothos: require('./assets/plants/pothos.png'),
};
const botanicalBackground = require('./assets/botanical-background.png');

const plantesInitiales = [
  {
    id: 'monstera',
    nom: 'Monstera',
    espece: 'Deliciosa',
    piece: 'Salon',
    categorie: 'Intérieur',
    image: plantImages.monstera,
    favori: true,
    humidite: 54,
    lumiere: 'Lumière indirecte',
    prochainArrosage: 'Demain',
    frequence: '7 jours',
    humeur: 'Stable',
    accent: '#CFE8A9',
    description:
      'Grande feuillage tropical, idéale pour une pièce lumineuse sans soleil direct.',
    conseils: [
      'Tournez le pot toutes les deux semaines pour une croissance régulière.',
      'Laissez sécher la surface du terreau avant un nouvel arrosage.',
      'Nettoyez les grandes feuilles pour aider la photosynthèse.',
    ],
    compatibles: ['Pothos doré', 'Calathea', 'Philodendron'],
  },
  {
    id: 'ficus',
    nom: 'Ficus',
    espece: 'Elastica',
    piece: 'Bureau',
    categorie: 'Intérieur',
    image: plantImages.ficus,
    favori: false,
    humidite: 39,
    lumiere: 'Lumière filtrée',
    prochainArrosage: 'Dans 2 j',
    frequence: '10 jours',
    humeur: 'À suivre',
    accent: '#E6D8A8',
    description:
      'Feuilles épaisses et brillantes, préfère une place stable et une lumière douce.',
    conseils: [
      'Évitez de le déplacer trop souvent, il préfère une routine stable.',
      'Augmentez légèrement l humidité si les bords brunissent.',
      'Un pot percé aide à éviter l eau stagnante.',
    ],
    compatibles: ['Sansevieria', 'Pilea', 'Zamioculcas'],
  },
  {
    id: 'basilic',
    nom: 'Basilic',
    espece: 'Grand vert',
    piece: 'Cuisine',
    categorie: 'Herbes',
    image: plantImages.basilic,
    favori: true,
    humidite: 63,
    lumiere: 'Soleil doux',
    prochainArrosage: 'Ce soir',
    frequence: '2 jours',
    humeur: 'En forme',
    accent: '#B9E87E',
    description:
      'Herbe aromatique lumineuse, demande un terreau frais et des tailles régulières.',
    conseils: [
      'Pincez les extrémités pour encourager une plante plus dense.',
      'Gardez le terreau légèrement humide sans le détremper.',
      'Placez-le près d une fenêtre lumineuse.',
    ],
    compatibles: ['Persil', 'Menthe', 'Ciboulette'],
  },
  {
    id: 'pothos',
    nom: 'Pothos',
    espece: 'Doré',
    piece: 'Entrée',
    categorie: 'Ombre',
    image: plantImages.pothos,
    favori: true,
    humidite: 47,
    lumiere: 'Ombre claire',
    prochainArrosage: 'Vendredi',
    frequence: '9 jours',
    humeur: 'Tolérant',
    accent: '#D8E986',
    description:
      'Plante retombante très facile, parfaite pour les coins à lumière indirecte.',
    conseils: [
      'Taillez les longues tiges pour garder une forme compacte.',
      'Ses panachures aiment une lumière douce.',
      'Un arrosage trop fréquent jaunit souvent les feuilles.',
    ],
    compatibles: ['Monstera', 'Spathiphyllum', 'Peperomia'],
  },
];

const onglets = [
  { id: 'jardin', label: 'Jardin', icon: 'leaf-outline' },
  { id: 'arrosage', label: 'Eau', icon: 'water-outline' },
  { id: 'conseils', label: 'IA', icon: 'sparkles-outline' },
  { id: 'suggestions', label: 'Pairs', icon: 'git-network-outline' },
];

const filtres = ['Toutes', 'Intérieur', 'Herbes', 'Ombre'];

export default function App() {
  const [ongletActif, setOngletActif] = useState('jardin');
  const [filtreActif, setFiltreActif] = useState('Toutes');
  const [plantes, setPlantes] = useState(plantesInitiales);
  const [planteActiveId, setPlanteActiveId] = useState(plantesInitiales[0].id);
  const [modeAuto, setModeAuto] = useState(true);
  const [dernierArrosage, setDernierArrosage] = useState('Système prêt');

  useEffect(() => {
    async function masquerBarresSysteme() {
      if (Platform.OS !== 'android') {
        return;
      }

      try {
        await NavigationBar.setVisibilityAsync('hidden');
        await NavigationBar.setBehaviorAsync('overlay-swipe');
        await NavigationBar.setBackgroundColorAsync('#061B15');
      } catch {
        // Expo Go peut ignorer certains réglages selon la version Android.
      }
    }

    masquerBarresSysteme();
  }, []);

  const planteActive = useMemo(
    () => plantes.find((plante) => plante.id === planteActiveId) ?? plantes[0],
    [plantes, planteActiveId]
  );

  const plantesFiltrees = useMemo(
    () =>
      filtreActif === 'Toutes'
        ? plantes
        : plantes.filter((plante) => plante.categorie === filtreActif),
    [filtreActif, plantes]
  );

  const plantesPrioritaires = useMemo(
    () =>
      [...plantes]
        .sort((a, b) => {
          if (a.favori !== b.favori) {
            return a.favori ? -1 : 1;
          }
          return a.humidite - b.humidite;
        })
        .slice(0, 3),
    [plantes]
  );

  const planteAArroser = useMemo(
    () => [...plantes].sort((a, b) => a.humidite - b.humidite)[0],
    [plantes]
  );

  const humiditeMoyenne = Math.round(
    plantes.reduce((total, plante) => total + plante.humidite, 0) / plantes.length
  );

  function arroserPlante(id) {
    setPlantes((liste) =>
      liste.map((plante) =>
        plante.id === id
          ? {
              ...plante,
              humidite: Math.min(plante.humidite + 12, 86),
              prochainArrosage: 'Relancé',
              humeur: 'Hydratée',
            }
          : plante
      )
    );
    const nom = plantes.find((plante) => plante.id === id)?.nom ?? 'plante';
    setDernierArrosage(`${nom} vient d être arrosée`);
  }

  function arroserTout() {
    setPlantes((liste) =>
      liste.map((plante) => ({
        ...plante,
        humidite: Math.min(plante.humidite + 10, 88),
        prochainArrosage: 'Cycle fini',
        humeur: 'Hydratée',
      }))
    );
    setDernierArrosage('Arrosage général terminé');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden />
      <ImageBackground source={botanicalBackground} resizeMode="cover" style={styles.backgroundImage}>
        <View style={styles.backgroundVeil} />
        <View style={styles.appShell}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {ongletActif === 'jardin' && (
              <View style={styles.emptyHome} />
          )}

          {ongletActif === 'arrosage' && (
            <>
              <View style={styles.detailHero}>
                <View style={styles.detailCopy}>
                  <Text style={styles.heroEyebrow}>station d arrosage</Text>
                  <Text style={styles.detailTitle}>Hydratation automatique</Text>
                  <Text style={styles.detailText}>
                    Planifiez un cycle général ou lancez une plante précise.
                  </Text>
                </View>
                <Image source={planteAArroser.image} style={styles.detailPlant} />
              </View>

              <View style={styles.controlStrip}>
                <Pressable
                  onPress={() => setModeAuto((valeur) => !valeur)}
                  style={[styles.autoButton, modeAuto && styles.autoButtonOn]}
                >
                  <Ionicons
                    name={modeAuto ? 'flash' : 'flash-outline'}
                    size={18}
                    color={modeAuto ? '#082219' : '#F5F0D8'}
                  />
                  <Text style={[styles.autoText, modeAuto && styles.autoTextOn]}>
                    {modeAuto ? 'Auto actif' : 'Auto pause'}
                  </Text>
                </Pressable>
                <Pressable onPress={arroserTout} style={styles.waterAllButton}>
                  <Ionicons name="water" size={18} color="#09251B" />
                  <Text style={styles.waterAllText}>Tout arroser</Text>
                </Pressable>
              </View>
              <Text style={styles.statusLine}>{dernierArrosage}</Text>

              {plantes.map((plante) => (
                <View key={plante.id} style={styles.waterRow}>
                  <View style={[styles.rowAccent, { backgroundColor: plante.accent }]} />
                  <View style={styles.waterInfo}>
                    <Text style={styles.waterName}>{plante.nom} {plante.espece}</Text>
                    <Text style={styles.waterMeta}>{plante.frequence} · {plante.lumiere}</Text>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${plante.humidite}%` }]} />
                    </View>
                  </View>
                  <Pressable onPress={() => arroserPlante(plante.id)} style={styles.rowButton}>
                    <Ionicons name="water-outline" size={21} color="#F5F0D8" />
                  </Pressable>
                </View>
              ))}
            </>
          )}

          {ongletActif === 'conseils' && (
            <>
              <View style={styles.advisorCard}>
                <Image source={planteActive.image} style={styles.advisorImage} />
                <View style={styles.advisorCopy}>
                  <Text style={styles.heroEyebrow}>conseiller IA</Text>
                  <Text style={styles.detailTitle}>{planteActive.nom} {planteActive.espece}</Text>
                  <Text style={styles.detailText}>
                    Lecture rapide de la lumière, de l humidité et du rythme de soin.
                  </Text>
                </View>
              </View>

              <View style={styles.selectorRow}>
                {plantes.map((plante) => (
                  <Pressable
                    key={plante.id}
                    onPress={() => setPlanteActiveId(plante.id)}
                    style={[
                      styles.selectorChip,
                      plante.id === planteActiveId && styles.selectorChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectorText,
                        plante.id === planteActiveId && styles.selectorTextActive,
                      ]}
                    >
                      {plante.nom}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {planteActive.conseils.map((conseil, index) => (
                <View key={conseil} style={styles.tipCard}>
                  <Text style={styles.tipIndex}>0{index + 1}</Text>
                  <Text style={styles.tipText}>{conseil}</Text>
                </View>
              ))}
            </>
          )}

          {ongletActif === 'suggestions' && (
            <>
              <View style={styles.detailHero}>
                <View style={styles.detailCopy}>
                  <Text style={styles.heroEyebrow}>voisinage végétal</Text>
                  <Text style={styles.detailTitle}>Plantes compatibles</Text>
                  <Text style={styles.detailText}>
                    Regroupez les plantes qui aiment la même lumière et le même rythme.
                  </Text>
                </View>
                <Image source={planteActive.image} style={styles.detailPlant} />
              </View>

              {plantes.map((plante) => (
                <View key={plante.id} style={styles.pairCard}>
                  <View>
                    <Text style={styles.pairTitle}>{plante.nom}</Text>
                    <Text style={styles.pairMeta}>{plante.piece} · {plante.lumiere}</Text>
                  </View>
                  <View style={styles.compatList}>
                    {plante.compatibles.map((nom) => (
                      <View key={nom} style={styles.compatChip}>
                        <Text style={styles.compatText}>{nom}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </>
            )}
          </ScrollView>

          <View style={styles.modernNav}>
            {onglets.map((onglet) => {
              const actif = ongletActif === onglet.id;
              return (
                <Pressable
                  key={onglet.id}
                  onPress={() => setOngletActif(onglet.id)}
                  style={[styles.modernNavItem, actif && styles.modernNavItemActive]}
                >
                  <Ionicons
                    name={onglet.icon}
                    size={22}
                    color={actif ? '#09251B' : '#DDEBBF'}
                  />
                  {actif && <Text style={styles.modernNavLabel}>{onglet.label}</Text>}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

function Metric({ icon, value }) {
  return (
    <View style={styles.metric}>
      <Ionicons name={icon} size={13} color="#DDEBBF" />
      <Text style={styles.metricText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#03140F',
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(1, 14, 10, 0.34)',
  },
  appShell: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  roundButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(245,240,216,0.10)',
    borderColor: 'rgba(245,240,216,0.18)',
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  brandBlock: {
    alignItems: 'center',
  },
  brand: {
    color: '#F5F0D8',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
  },
  brandMeta: {
    color: '#9EBA93',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  content: {
    paddingBottom: 104,
  },
  emptyHome: {
    minHeight: 620,
  },
  cleanHeroSpace: {
    height: 120,
  },
  homeHeader: {
    alignItems: 'center',
    backgroundColor: 'rgba(242, 238, 215, 0.10)',
    borderColor: 'rgba(221, 235, 191, 0.18)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 16,
  },
  homeHeaderKicker: {
    color: '#AFC6A5',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  homeHeaderTitle: {
    color: '#F2EED7',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 32,
    marginTop: 3,
  },
  homeHeaderBadge: {
    alignItems: 'center',
    backgroundColor: '#DDEBBF',
    borderRadius: 8,
    minWidth: 76,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  homeHeaderBadgeValue: {
    color: '#09251B',
    fontSize: 18,
    fontWeight: '900',
  },
  homeHeaderBadgeLabel: {
    color: '#476B4F',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 1,
    textTransform: 'uppercase',
  },
  quickSummary: {
    alignItems: 'center',
    backgroundColor: 'rgba(3, 20, 15, 0.62)',
    borderColor: 'rgba(221, 235, 191, 0.14)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    padding: 14,
  },
  quickItem: {
    minWidth: 62,
  },
  quickItemWide: {
    flex: 1,
  },
  quickValue: {
    color: '#F2EED7',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 25,
  },
  quickLabel: {
    color: '#AFC6A5',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  quickText: {
    color: '#F2EED7',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3,
  },
  quickDivider: {
    backgroundColor: 'rgba(221, 235, 191, 0.18)',
    height: 36,
    marginHorizontal: 14,
    width: 1,
  },
  homeIntro: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  homeTitleSmall: {
    color: '#F5F0D8',
    fontSize: 23,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 28,
  },
  homeTitleStrong: {
    color: '#BEE385',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 32,
  },
  menuChip: {
    alignItems: 'center',
    backgroundColor: '#EEF3E5',
    borderColor: 'rgba(36,61,19,0.18)',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  priorityCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(242, 238, 215, 0.12)',
    borderColor: 'rgba(242, 238, 215, 0.16)',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 270,
    marginBottom: 14,
    overflow: 'hidden',
    padding: 18,
  },
  priorityCopy: {
    alignItems: 'center',
    marginTop: 'auto',
    zIndex: 1,
  },
  priorityLabel: {
    color: '#476B4F',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  priorityName: {
    color: '#F2EED7',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 27,
    marginTop: 8,
    textAlign: 'center',
  },
  priorityMeta: {
    color: '#BBD1AD',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 4,
    textAlign: 'center',
  },
  priorityButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#DDEBBF',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    marginTop: 14,
    minWidth: 150,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  priorityButtonText: {
    color: '#09251B',
    fontSize: 13,
    fontWeight: '900',
  },
  priorityImage: {
    height: 158,
    marginBottom: 6,
    width: 158,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    color: '#F2EED7',
    fontSize: 19,
    fontWeight: '900',
  },
  sectionCount: {
    color: '#AFC6A5',
    fontSize: 13,
    fontWeight: '800',
  },
  favoriteRail: {
    gap: 12,
    paddingBottom: 18,
  },
  favoriteCard: {
    backgroundColor: 'rgba(221, 235, 191, 0.12)',
    borderColor: 'rgba(221, 235, 191, 0.18)',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 158,
    overflow: 'hidden',
    padding: 12,
    width: 126,
  },
  favoriteCardActive: {
    borderColor: '#DDEBBF',
  },
  favoriteImage: {
    height: 92,
    marginBottom: 8,
    width: 92,
  },
  favoriteName: {
    color: '#F2EED7',
    fontSize: 15,
    fontWeight: '900',
  },
  favoriteMeta: {
    color: '#BBD1AD',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },
  profilePanel: {
    backgroundColor: 'rgba(3, 20, 15, 0.58)',
    borderColor: 'rgba(221,235,191,0.10)',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 14,
    overflow: 'hidden',
    padding: 18,
  },
  profileKicker: {
    color: '#A6C98A',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  profileTitle: {
    color: '#F2EED7',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 25,
  },
  profileText: {
    color: '#C4D6BA',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 6,
  },
  profileStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  profileStat: {
    alignItems: 'center',
    backgroundColor: 'rgba(221,235,191,0.12)',
    borderColor: 'rgba(221,235,191,0.18)',
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  profileStatText: {
    color: '#DDEBBF',
    fontSize: 12,
    fontWeight: '900',
  },
  hero: {
    borderRadius: 8,
    height: 330,
    marginBottom: 18,
    overflow: 'hidden',
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6,27,21,0.34)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  heroPill: {
    alignItems: 'center',
    backgroundColor: '#F5F0D8',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  heroPillText: {
    color: '#09251B',
    fontSize: 12,
    fontWeight: '900',
  },
  heroAction: {
    alignItems: 'center',
    backgroundColor: '#CFE8A9',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  heroCopy: {
    bottom: 22,
    left: 18,
    position: 'absolute',
    right: 18,
  },
  heroEyebrow: {
    color: '#CFE8A9',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#F5F0D8',
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 56,
    marginTop: 6,
  },
  heroText: {
    color: '#D8E4C8',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    marginTop: 10,
    maxWidth: 250,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: 'rgba(221, 235, 191, 0.10)',
    borderColor: 'rgba(221, 235, 191, 0.16)',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: '#DDEBBF',
  },
  filterText: {
    color: '#C4D6BA',
    fontSize: 13,
    fontWeight: '900',
  },
  filterTextActive: {
    color: '#09251B',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  plantTile: {
    backgroundColor: 'rgba(9, 44, 29, 0.72)',
    borderColor: 'rgba(221, 235, 191, 0.16)',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 10,
    width: '48%',
  },
  plantTileActive: {
    borderColor: '#DDEBBF',
  },
  tileImageStage: {
    alignItems: 'center',
    backgroundColor: 'rgba(221, 235, 191, 0.10)',
    borderRadius: 8,
    height: 104,
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  tileImage: {
    height: 122,
    opacity: 0.98,
    width: 122,
  },
  tileName: {
    color: '#F2EED7',
    fontSize: 16,
    fontWeight: '900',
  },
  tileSpecies: {
    color: '#BBD1AD',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  tileStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  metric: {
    alignItems: 'center',
    borderColor: 'rgba(221, 235, 191, 0.18)',
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  metricText: {
    color: '#DDEBBF',
    fontSize: 11,
    fontWeight: '800',
  },
  tileFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  nextText: {
    color: '#BBD1AD',
    fontSize: 12,
    fontWeight: '800',
  },
  plusButton: {
    alignItems: 'center',
    backgroundColor: '#DDEBBF',
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  detailHero: {
    backgroundColor: '#315E40',
    borderColor: 'rgba(245,240,216,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    minHeight: 220,
    overflow: 'hidden',
    padding: 18,
  },
  detailCopy: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 1,
  },
  detailTitle: {
    color: '#F5F0D8',
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 34,
    marginTop: 6,
  },
  detailText: {
    color: '#D8E4C8',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 10,
  },
  detailPlant: {
    bottom: -18,
    height: 210,
    opacity: 0.95,
    position: 'absolute',
    right: -34,
    width: 210,
  },
  controlStrip: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  autoButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(245,240,216,0.09)',
    borderColor: 'rgba(245,240,216,0.14)',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
  },
  autoButtonOn: {
    backgroundColor: '#CFE8A9',
  },
  autoText: {
    color: '#F5F0D8',
    fontSize: 14,
    fontWeight: '900',
  },
  autoTextOn: {
    color: '#082219',
  },
  waterAllButton: {
    alignItems: 'center',
    backgroundColor: '#F5F0D8',
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
  },
  waterAllText: {
    color: '#09251B',
    fontSize: 14,
    fontWeight: '900',
  },
  statusLine: {
    color: '#AFC6A5',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
  },
  waterRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(245,240,216,0.08)',
    borderColor: 'rgba(245,240,216,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    padding: 12,
  },
  rowAccent: {
    borderRadius: 8,
    height: 52,
    width: 8,
  },
  waterInfo: {
    flex: 1,
  },
  waterName: {
    color: '#F5F0D8',
    fontSize: 16,
    fontWeight: '900',
  },
  waterMeta: {
    color: '#AFC6A5',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  progressTrack: {
    backgroundColor: 'rgba(245,240,216,0.12)',
    borderRadius: 8,
    height: 7,
    marginTop: 9,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#CFE8A9',
    borderRadius: 8,
    height: '100%',
  },
  rowButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(245,240,216,0.12)',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  advisorCard: {
    backgroundColor: '#315E40',
    borderColor: 'rgba(245,240,216,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    minHeight: 280,
    overflow: 'hidden',
  },
  advisorImage: {
    height: 190,
    opacity: 0.95,
    position: 'absolute',
    right: -26,
    top: -10,
    width: 190,
  },
  advisorCopy: {
    bottom: 20,
    left: 18,
    position: 'absolute',
    right: 18,
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  selectorChip: {
    backgroundColor: 'rgba(245,240,216,0.09)',
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  selectorChipActive: {
    backgroundColor: '#F5F0D8',
  },
  selectorText: {
    color: '#C1D0B8',
    fontSize: 13,
    fontWeight: '900',
  },
  selectorTextActive: {
    color: '#09251B',
  },
  tipCard: {
    backgroundColor: 'rgba(245,240,216,0.08)',
    borderColor: 'rgba(245,240,216,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 10,
    padding: 14,
  },
  tipIndex: {
    color: '#CFE8A9',
    fontSize: 20,
    fontWeight: '900',
  },
  tipText: {
    color: '#D8E4C8',
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  pairCard: {
    backgroundColor: 'rgba(245,240,216,0.08)',
    borderColor: 'rgba(245,240,216,0.12)',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 15,
  },
  pairTitle: {
    color: '#F5F0D8',
    fontSize: 19,
    fontWeight: '900',
  },
  pairMeta: {
    color: '#AFC6A5',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  compatList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 13,
  },
  compatChip: {
    backgroundColor: '#CFE8A9',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  compatText: {
    color: '#09251B',
    fontSize: 12,
    fontWeight: '900',
  },
  modernNav: {
    alignItems: 'center',
    backgroundColor: 'rgba(3, 20, 15, 0.78)',
    borderColor: 'rgba(221,235,191,0.18)',
    borderRadius: 8,
    borderWidth: 1,
    bottom: 22,
    flexDirection: 'row',
    gap: 7,
    left: 18,
    minHeight: 66,
    padding: 7,
    position: 'absolute',
    right: 18,
  },
  modernNavItem: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  modernNavItemActive: {
    backgroundColor: '#DDEBBF',
    flex: 1.35,
  },
  modernNavLabel: {
    color: '#09251B',
    fontSize: 12,
    fontWeight: '900',
  },
  petalNav: {
    bottom: 0,
    height: 188,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  petalHit: {
    alignItems: 'center',
    height: 54,
    justifyContent: 'center',
    position: 'absolute',
    width: 54,
  },
  petalHit0: {
    bottom: 42,
    left: 70,
  },
  petalHit1: {
    bottom: 92,
    left: 148,
  },
  petalHit2: {
    bottom: 92,
    right: 148,
  },
  petalHit3: {
    bottom: 42,
    right: 70,
  },
  leafNav: {
    bottom: 0,
    height: 170,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  leafHub: {
    alignSelf: 'center',
    backgroundColor: 'rgba(242, 238, 215, 0.96)',
    borderColor: 'rgba(221,235,191,0.55)',
    borderRadius: 78,
    borderWidth: 2,
    bottom: -62,
    height: 132,
    position: 'absolute',
    width: 156,
    zIndex: 10,
  },
  leafButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(9, 44, 29, 0.78)',
    borderColor: 'rgba(221,235,191,0.42)',
    borderTopLeftRadius: 64,
    borderTopRightRadius: 64,
    borderBottomLeftRadius: 64,
    borderBottomRightRadius: 14,
    borderWidth: 2,
    bottom: 44,
    height: 112,
    justifyContent: 'center',
    paddingBottom: 30,
    position: 'absolute',
    width: 86,
    zIndex: 3,
  },
  leafButton0: {
    left: '50%',
    bottom: 34,
    marginLeft: -146,
    transform: [{ rotate: '-68deg' }],
    zIndex: 2,
  },
  leafButton1: {
    left: '50%',
    bottom: 66,
    marginLeft: -82,
    transform: [{ rotate: '-20deg' }],
    zIndex: 5,
  },
  leafButton2: {
    left: '50%',
    bottom: 66,
    marginLeft: -4,
    transform: [{ rotate: '20deg' }],
    zIndex: 5,
  },
  leafButton3: {
    left: '50%',
    bottom: 34,
    marginLeft: 60,
    transform: [{ rotate: '68deg' }],
    zIndex: 2,
  },
  leafButtonActive: {
    backgroundColor: '#DDEBBF',
    borderColor: '#F2EED7',
  },
  leafContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
  },
  leafContent0: {
    transform: [{ rotate: '68deg' }],
  },
  leafContent1: {
    transform: [{ rotate: '20deg' }],
  },
  leafContent2: {
    transform: [{ rotate: '-20deg' }],
  },
  leafContent3: {
    transform: [{ rotate: '-68deg' }],
  },
  leafLabel: {
    color: '#DDEBBF',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 3,
  },
  leafLabelActive: {
    color: '#09251B',
  },
  navButton: {
    alignItems: 'center',
    borderRadius: 7,
    flex: 1,
    gap: 3,
    minHeight: 54,
    justifyContent: 'center',
  },
  navButtonActive: {
    backgroundColor: '#F5F0D8',
  },
  navLabel: {
    color: '#B9C9B0',
    fontSize: 11,
    fontWeight: '900',
  },
  navLabelActive: {
    color: '#09251B',
  },
});
