import { useRef, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { botanicalBackground } from '../../../data/plants';
import { usePlantsStore } from '../../../contexts/PlantsContext';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const cameraRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { plants, updatePlantPhoto, waterPlant } = usePlantsStore();
  const plant = plants.find((item) => String(item.id) === String(id)) ?? plants[0];

  async function openCamera() {
    if (!permission?.granted) {
      const response = await requestPermission();
      if (!response.granted) return;
    }
    setCameraOpen(true);
  }

  async function takePlantPhoto() {
    if (!cameraRef.current || takingPhoto || !plant) return;
    setTakingPhoto(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.82, skipProcessing: false });
      if (photo?.uri) await updatePlantPhoto(plant.id, photo.uri);
      setCameraOpen(false);
    } finally {
      setTakingPhoto(false);
    }
  }

  if (!plant) {
    return (
      <ImageBackground source={botanicalBackground} resizeMode="cover" style={styles.bg}>
        <View style={styles.veil} />
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Plante introuvable</Text>
        </View>
      </ImageBackground>
    );
  }

  if (cameraOpen) {
    return (
      <View style={styles.cameraScreen}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        <View style={styles.cameraShade} />
        <View style={styles.cameraTop}>
          <Pressable onPress={() => setCameraOpen(false)} style={styles.cameraIconButton}>
            <Ionicons name="close" color="#F8FFE8" size={22} />
          </Pressable>
          <Text style={styles.cameraTitle}>Photo de {plant.name}</Text>
        </View>
        <View style={styles.cameraBottom}>
          <Pressable onPress={takePlantPhoto} style={styles.shutterButton}>
            <View style={styles.shutterInner} />
          </Pressable>
          <Text style={styles.cameraHint}>{takingPhoto ? 'Capture...' : 'Cadrez la plante puis touchez le bouton'}</Text>
        </View>
      </View>
    );
  }

  return (
    <ImageBackground source={botanicalBackground} resizeMode="cover" style={styles.bg}>
      <View style={styles.veil} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.phoneCard}>
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="chevron-back" color="#8BA59A" size={22} />
            </Pressable>
            <Pressable onPress={openCamera} style={styles.cameraButton}>
              <Ionicons name="camera-outline" color="#073323" size={19} />
            </Pressable>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.name}>{plant.name}</Text>
            <Text style={styles.species}>{plant.species}</Text>
          </View>

          <View style={styles.heroArea}>
            <View style={styles.metricColumn}>
              <DetailMetric label="Arrosage" value={`${plant.humidity}%`} />
              <DetailMetric label="Cycle" value={plant.frequency} />
              <DetailMetric label="Piece" value={plant.room} />
              <DetailMetric label="Etat" value={plant.mood} />
            </View>

            <View style={styles.imageHalo}>
              <Image source={plant.image} style={styles.heroImage} />
            </View>
          </View>

          <View style={styles.waterCard}>
            <View>
              <Text style={styles.waterLabel}>Niveau d'eau</Text>
              <Text style={styles.waterValue}>{plant.humidity}%</Text>
            </View>
            <View style={styles.waterTrack}>
              <View style={[styles.waterFill, { width: `${Math.min(plant.humidity, 100)}%` }]} />
            </View>
          </View>

          <View style={styles.careGrid}>
            <CareTile icon="calendar-outline" label="Prochaine" value={plant.nextWatering} />
            <CareTile icon="sunny-outline" label="Lumiere" value={plant.light} />
            <CareTile icon="leaf-outline" label="Type" value={plant.category} />
          </View>

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Routine</Text>
              <Text style={styles.infoValue}>Soins doux et reguliers</Text>
            </View>
            <Pressable onPress={() => waterPlant(plant.id)} style={styles.nextButton}>
              <Ionicons name="water" color="#073323" size={17} />
              <Text style={styles.nextText}>Arroser</Text>
            </Pressable>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Conseils</Text>
            {plant.tips.map((tip) => (
              <View key={tip} style={styles.tipRow}>
                <Ionicons name="checkmark-circle-outline" color="#66CFA0" size={18} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Bonnes voisines</Text>
            <View style={styles.chips}>
              {plant.compatible.map((name) => (
                <View key={name} style={styles.chip}>
                  <Text style={styles.chipText}>{name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function DetailMetric({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function CareTile({ icon, label, value }) {
  return (
    <View style={styles.careTile}>
      <Ionicons name={icon} color="#6FB98F" size={17} />
      <Text style={styles.careLabel}>{label}</Text>
      <Text numberOfLines={1} style={styles.careValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(1,24,15,0.32)' },
  content: { padding: 18, paddingBottom: 46, paddingTop: 34 },
  phoneCard: {
    backgroundColor: '#F7FBF5',
    borderRadius: 34,
    minHeight: 700,
    overflow: 'visible',
    padding: 20,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleBlock: {
    marginTop: 18,
  },
  iconButton: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  cameraButton: {
    alignItems: 'center',
    backgroundColor: '#57E59A',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  heroArea: {
    flexDirection: 'row',
    minHeight: 280,
    paddingTop: 10,
    position: 'relative',
  },
  metricColumn: {
    justifyContent: 'flex-start',
    paddingTop: 18,
    width: 96,
  },
  stat: { marginBottom: 18 },
  statValue: { color: '#14241E', fontSize: 19, fontWeight: '800' },
  statLabel: { color: '#8BA59A', fontSize: 10, fontWeight: '900', marginTop: 3 },
  imageHalo: {
    alignItems: 'center',
    bottom: -2,
    justifyContent: 'center',
    position: 'absolute',
    right: -94,
    top: -16,
    width: 292,
  },
  heroImage: { height: 292, resizeMode: 'contain', width: 292 },
  name: { color: '#0D1824', fontSize: 31, fontWeight: '900' },
  species: { color: '#8BA59A', fontSize: 13, fontWeight: '800', marginTop: 2 },
  waterCard: {
    backgroundColor: '#EEF7FA',
    borderRadius: 28,
    gap: 12,
    marginTop: 4,
    padding: 16,
  },
  waterLabel: { color: '#8BA59A', fontSize: 11, fontWeight: '900' },
  waterValue: { color: '#0D1824', fontSize: 28, fontWeight: '300', marginTop: 2 },
  waterTrack: {
    backgroundColor: '#DCECF1',
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  waterFill: {
    backgroundColor: '#66CFA0',
    borderRadius: 999,
    height: '100%',
  },
  careGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  careTile: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8F0EE',
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    minHeight: 94,
    padding: 12,
  },
  careLabel: { color: '#8BA59A', fontSize: 10, fontWeight: '900', marginTop: 8 },
  careValue: { color: '#14241E', fontSize: 12, fontWeight: '900', marginTop: 4 },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  infoLabel: { color: '#8BA59A', fontSize: 11, fontWeight: '900' },
  infoValue: { color: '#0D1824', fontSize: 15, fontWeight: '900', marginTop: 4 },
  nextButton: {
    alignItems: 'center',
    backgroundColor: '#DFF7D3',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    minHeight: 58,
    paddingHorizontal: 22,
  },
  nextText: { color: '#0D1824', fontSize: 13, fontWeight: '900' },
  panel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8F0EE',
    borderRadius: 26,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  panelTitle: { color: '#0D1824', fontSize: 18, fontWeight: '900', marginBottom: 10 },
  tipRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
  },
  tipText: { color: '#49655B', flex: 1, fontSize: 13, fontWeight: '700', lineHeight: 19 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#EEF7EA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: { color: '#315B45', fontSize: 12, fontWeight: '800' },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: { color: '#F8FFE8', fontSize: 22, fontWeight: '900' },
  cameraScreen: { backgroundColor: '#03140F', flex: 1 },
  camera: { ...StyleSheet.absoluteFillObject },
  cameraShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,20,15,0.16)' },
  cameraTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    left: 18,
    position: 'absolute',
    right: 18,
    top: 38,
  },
  cameraIconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(3,20,15,0.72)',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  cameraTitle: { color: '#F8FFE8', flex: 1, fontSize: 18, fontWeight: '900' },
  cameraBottom: {
    alignItems: 'center',
    bottom: 42,
    left: 18,
    position: 'absolute',
    right: 18,
  },
  shutterButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(248,255,232,0.32)',
    borderColor: '#F8FFE8',
    borderRadius: 999,
    borderWidth: 3,
    height: 78,
    justifyContent: 'center',
    width: 78,
  },
  shutterInner: {
    backgroundColor: '#F8FFE8',
    borderRadius: 999,
    height: 58,
    width: 58,
  },
  cameraHint: {
    color: '#DDEBBF',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 14,
    textAlign: 'center',
  },
});
