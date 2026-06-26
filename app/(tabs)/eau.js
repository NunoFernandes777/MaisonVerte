import { useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { botanicalBackground } from '../../data/plants';
import { usePlantsStore } from '../../contexts/PlantsContext';

const WATER_MAX = 88;

export default function EauScreen() {
  const router = useRouter();
  const { addPlant, deletePlant, empty, error, loading, plants, waterAll } = usePlantsStore();
  const [deleteMode, setDeleteMode] = useState(false);

  const waterLevel = plants.length
    ? plants.reduce((sum, plant) => sum + Math.min(plant.humidity, WATER_MAX), 0) / (plants.length * WATER_MAX)
    : 0;
  const waterPercent = Math.round(waterLevel * 100);

  function handleAddPlant() {
    addPlant({
      name: 'Nouvelle plante',
      species: 'A identifier',
      room: 'Maison',
      category: 'Interieur',
      imageKey: 'monstera',
      favorite: false,
      humidity: 34,
      light: 'Lumiere douce',
      nextWatering: 'Dans 3 j',
      frequency: '7 jours',
      mood: 'Nouvelle',
      accent: '#BFE7A8',
      description: 'Ajoutez une photo et completez les informations de cette plante.',
      tips: [
        'Observez la lumiere pendant quelques jours avant de choisir sa place.',
        'Touchez la surface du terreau avant chaque arrosage.',
      ],
      compatible: ['Pothos', 'Ficus', 'Monstera'],
    });
  }

  function handlePlantPress(plant) {
    if (deleteMode) {
      deletePlant(plant.id);
      return;
    }
    router.push(`/plante/${plant.id}`);
  }

  return (
    <ImageBackground source={botanicalBackground} resizeMode="cover" style={styles.bg}>
      <View style={styles.veil} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Mes Plantes</Text>
        </View>

        {loading && <Text style={styles.stateText}>Chargement...</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
        {empty && (
          <View style={styles.emptyCard}>
            <Ionicons name="leaf-outline" color="#DDEBBF" size={30} />
            <Text style={styles.emptyTitle}>Aucune plante</Text>
            <Text style={styles.emptyText}>Ajoutez votre premiere plante avec le bouton +.</Text>
          </View>
        )}

        <View style={styles.grid}>
          {plants.map((plant) => (
            <Pressable
              key={plant.id}
              onPress={() => handlePlantPress(plant)}
              style={[styles.card, deleteMode && styles.cardDeleteMode]}
            >
              {deleteMode && (
                <View style={styles.deleteBadge}>
                  <Ionicons name="trash-outline" color="#FFF7EA" size={16} />
                </View>
              )}
              <View style={styles.cardStage}>
                <Image source={plant.image} style={styles.plantImage} />
              </View>
              <View style={styles.cardFooter}>
                <Text numberOfLines={1} style={styles.cardTitle}>{plant.name}</Text>
                <Text numberOfLines={1} style={styles.cardMeta}>{plant.room} - {plant.humidity}%</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.floatingActions}>
        <Pressable onPress={handleAddPlant} style={styles.sideAction}>
          <Ionicons name="add" color="#073323" size={25} />
        </Pressable>

        <Pressable onPress={waterAll} style={styles.waterAction}>
          <View style={[styles.waterFill, { height: `${waterPercent}%` }]} />
          <View style={styles.waterShine} />
          <Ionicons name="water" color={waterPercent > 58 ? '#F7FFE9' : '#0C3A29'} size={28} />
          <Text style={[styles.waterPercent, waterPercent > 58 && styles.waterPercentLight]}>{waterPercent}%</Text>
        </Pressable>

        <Pressable
          onPress={() => setDeleteMode((active) => !active)}
          style={[styles.sideAction, deleteMode && styles.sideActionDanger]}
        >
          <Ionicons name={deleteMode ? 'close' : 'trash-outline'} color={deleteMode ? '#FFF7EA' : '#073323'} size={23} />
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(1,24,15,0.36)' },
  content: { padding: 18, paddingBottom: 178, paddingTop: 58 },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#F6FFE8', fontSize: 34, fontWeight: '900', textAlign: 'center' },
  stateText: { color: '#CFEFC2', fontSize: 13, fontWeight: '800', marginTop: 14 },
  error: { color: '#FFE5D1', fontSize: 13, fontWeight: '800', marginTop: 14 },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(4,56,35,0.32)',
    borderColor: 'rgba(221,235,191,0.14)',
    borderRadius: 28,
    borderWidth: 1,
    marginTop: 28,
    padding: 20,
  },
  emptyTitle: { color: '#F6FFE8', fontSize: 20, fontWeight: '900', marginTop: 10 },
  emptyText: { color: '#DDEBBF', fontSize: 13, fontWeight: '700', marginTop: 6, textAlign: 'center' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 14,
    justifyContent: 'space-between',
    marginTop: 24,
  },
  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(137,178,130,0.26)',
    borderColor: 'rgba(221,235,191,0.10)',
    borderRadius: 32,
    borderWidth: 1,
    height: 222,
    overflow: 'hidden',
    width: '48%',
  },
  cardDeleteMode: {
    borderColor: 'rgba(255,247,234,0.42)',
    transform: [{ scale: 0.98 }],
  },
  deleteBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(143,45,34,0.82)',
    borderRadius: 999,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 32,
    zIndex: 2,
  },
  cardStage: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 16,
    width: '100%',
  },
  plantImage: { height: 142, resizeMode: 'contain', width: 132 },
  cardFooter: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingBottom: 13,
    paddingHorizontal: 10,
    paddingTop: 10,
    width: '100%',
  },
  cardTitle: { color: '#F6FFE8', fontSize: 15, fontWeight: '900' },
  cardMeta: { color: '#DDEBBF', fontSize: 11, fontWeight: '700', marginTop: 3 },
  floatingActions: {
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 96,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 20,
  },
  sideAction: {
    alignItems: 'center',
    backgroundColor: 'rgba(246,255,232,0.94)',
    borderColor: 'rgba(255,255,255,0.72)',
    borderRadius: 999,
    borderWidth: 1,
    height: 54,
    justifyContent: 'center',
    shadowColor: '#001C12',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    width: 54,
  },
  sideActionDanger: {
    backgroundColor: 'rgba(135,54,43,0.92)',
    borderColor: 'rgba(255,247,234,0.40)',
  },
  waterAction: {
    alignItems: 'center',
    backgroundColor: 'rgba(246,255,232,0.94)',
    borderColor: 'rgba(255,255,255,0.76)',
    borderRadius: 999,
    borderWidth: 1,
    height: 76,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#001C12',
    shadowOpacity: 0.30,
    shadowRadius: 18,
    width: 76,
  },
  waterFill: {
    backgroundColor: '#36A9E1',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  waterShine: {
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderRadius: 999,
    height: 34,
    position: 'absolute',
    right: 11,
    top: 8,
    width: 24,
  },
  waterPercent: {
    color: '#0C3A29',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
  },
  waterPercentLight: {
    color: '#F7FFE9',
  },
});
