import { useCallback, useEffect, useMemo, useState } from 'react';
import { defaultPlants, fromDatabase, toDatabase, withImage } from '../data/plants';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function usePlants() {
  const { user } = useAuth();
  const [plants, setPlants] = useState(defaultPlants.map(withImage));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canUseRemote = isSupabaseConfigured && Boolean(user);

  const loadPlants = useCallback(async () => {
    setError(null);

    if (!canUseRemote) {
      setPlants(defaultPlants.map(withImage));
      return;
    }

    setLoading(true);
    const { data, error: queryError } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: true });

    if (queryError) {
      setError(queryError.message);
      setPlants([]);
    } else {
      setPlants((data || []).map(fromDatabase));
    }
    setLoading(false);
  }, [canUseRemote]);

  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  const waterPlant = useCallback(
    async (id) => {
      const target = plants.find((plant) => plant.id === id);
      if (!target) return;

      const nextHumidity = Math.min(target.humidity + 12, 88);
      setPlants((items) =>
        items.map((plant) =>
          plant.id === id
            ? { ...plant, humidity: nextHumidity, nextWatering: 'Relance', mood: 'Hydratee' }
            : plant
        )
      );

      if (canUseRemote) {
        const { error: updateError } = await supabase
          .from('plants')
          .update({ humidity: nextHumidity, next_watering: 'Relance', mood: 'Hydratee' })
          .eq('id', id);
        if (updateError) setError(updateError.message);
      }
    },
    [canUseRemote, plants]
  );

  const waterAll = useCallback(async () => {
    const updated = plants.map((plant) => ({
      ...plant,
      humidity: Math.min(plant.humidity + 10, 88),
      nextWatering: 'Cycle fini',
      mood: 'Hydratee',
    }));
    setPlants(updated);

    if (canUseRemote) {
      await Promise.all(
        updated.map((plant) =>
          supabase
            .from('plants')
            .update({
              humidity: plant.humidity,
              next_watering: plant.nextWatering,
              mood: plant.mood,
            })
            .eq('id', plant.id)
        )
      );
    }
  }, [canUseRemote, plants]);

  const addPlant = useCallback(
    async (plant) => {
      const localPlant = withImage({ ...plant, id: `${Date.now()}` });
      setPlants((items) => [...items, localPlant]);

      if (canUseRemote) {
        const { error: insertError } = await supabase.from('plants').insert(toDatabase(plant, user.id));
        if (insertError) setError(insertError.message);
        await loadPlants();
      }
    },
    [canUseRemote, loadPlants, user]
  );

  const deletePlant = useCallback(
    async (id) => {
      setPlants((items) => items.filter((plant) => plant.id !== id));

      if (canUseRemote) {
        const { error: deleteError } = await supabase.from('plants').delete().eq('id', id);
        if (deleteError) setError(deleteError.message);
      }
    },
    [canUseRemote]
  );

  const updatePlantPhoto = useCallback(
    async (id, photoUri) => {
      setPlants((items) =>
        items.map((plant) => (plant.id === id ? withImage({ ...plant, photoUri }) : plant))
      );

      if (canUseRemote) {
        const { error: updateError } = await supabase.from('plants').update({ photo_uri: photoUri }).eq('id', id);
        if (updateError) setError(updateError.message);
      }
    },
    [canUseRemote]
  );

  const empty = !loading && plants.length === 0;

  return useMemo(
    () => ({ addPlant, deletePlant, empty, error, loadPlants, loading, plants, updatePlantPhoto, waterAll, waterPlant }),
    [addPlant, deletePlant, empty, error, loadPlants, loading, plants, updatePlantPhoto, waterAll, waterPlant]
  );
}
