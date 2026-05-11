import { useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { Crop, CropActivity, GrowthStage } from '@/types/crop';
import { generateId, calculateAutoStage } from '@/utils/helpers';

const CROPS_STORAGE_KEY = 'kishan_crops';

async function loadCrops(): Promise<Crop[]> {
  const stored = await AsyncStorage.getItem(CROPS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

async function saveCrops(crops: Crop[]): Promise<Crop[]> {
  await AsyncStorage.setItem(CROPS_STORAGE_KEY, JSON.stringify(crops));
  return crops;
}

export const [CropProvider, useCrops] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [crops, setCrops] = useState<Crop[]>([]);

  const cropsQuery = useQuery({
    queryKey: ['crops'],
    queryFn: loadCrops,
  });

  const syncMutation = useMutation({
    mutationFn: saveCrops,
  });

  useEffect(() => {
    if (cropsQuery.data) {
      const updatedCrops = cropsQuery.data.map(crop => {
        if (crop.currentStage === 'completed') return crop;
        const autoStage = calculateAutoStage(crop.sowingDate, crop.expectedHarvestDate);
        if (autoStage !== crop.currentStage) {
          console.log(`Auto-updating ${crop.name} stage: ${crop.currentStage} -> ${autoStage}`);
          return { ...crop, currentStage: autoStage };
        }
        return crop;
      });
      setCrops(updatedCrops);
      const hasChanges = updatedCrops.some((c, i) => c.currentStage !== cropsQuery.data![i].currentStage);
      if (hasChanges) {
        saveCrops(updatedCrops);
      }
    }
  }, [cropsQuery.data]);

  const autoUpdateStages = useCallback(() => {
    const updatedCrops = crops.map(crop => {
      if (crop.currentStage === 'completed') return crop;
      const autoStage = calculateAutoStage(crop.sowingDate, crop.expectedHarvestDate);
      if (autoStage !== crop.currentStage) {
        console.log(`Auto-updating ${crop.name} stage: ${crop.currentStage} -> ${autoStage}`);
        return { ...crop, currentStage: autoStage };
      }
      return crop;
    });
    const hasChanges = updatedCrops.some((c, i) => c.currentStage !== crops[i].currentStage);
    if (hasChanges) {
      setCrops(updatedCrops);
      syncMutation.mutate(updatedCrops);
    }
  }, [crops, syncMutation]);

  useEffect(() => {
    const interval = setInterval(autoUpdateStages, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoUpdateStages]);

  const addCrop = useCallback((cropData: Omit<Crop, 'id' | 'activities' | 'createdAt'>) => {
    const newCrop: Crop = {
      ...cropData,
      id: generateId(),
      activities: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...crops, newCrop];
    setCrops(updated);
    syncMutation.mutate(updated);
    console.log('Crop added:', newCrop.name);
    return newCrop;
  }, [crops, syncMutation]);

  const updateCrop = useCallback((id: string, updates: Partial<Crop>) => {
    const updated = crops.map(c => c.id === id ? { ...c, ...updates } : c);
    setCrops(updated);
    syncMutation.mutate(updated);
    console.log('Crop updated:', id);
  }, [crops, syncMutation]);

  const deleteCrop = useCallback((id: string) => {
    const updated = crops.filter(c => c.id !== id);
    setCrops(updated);
    syncMutation.mutate(updated);
    console.log('Crop deleted:', id);
  }, [crops, syncMutation]);

  const updateStage = useCallback((id: string, stage: GrowthStage) => {
    updateCrop(id, { currentStage: stage });
    console.log('Stage updated:', id, stage);
  }, [updateCrop]);

  const addActivity = useCallback((cropId: string, activityData: Omit<CropActivity, 'id' | 'cropId'>) => {
    const activity: CropActivity = {
      ...activityData,
      id: generateId(),
      cropId,
    };
    const crop = crops.find(c => c.id === cropId);
    if (crop) {
      const updated = crops.map(c =>
        c.id === cropId
          ? { ...c, activities: [...c.activities, activity] }
          : c
      );
      setCrops(updated);
      syncMutation.mutate(updated);
      console.log('Activity added to crop:', cropId, activity.title);
    }
    return activity;
  }, [crops, syncMutation]);

  const getCropById = useCallback((id: string): Crop | undefined => {
    return crops.find(c => c.id === id);
  }, [crops]);

  const activeCrops = useMemo(() => crops.filter(c => c.currentStage !== 'completed'), [crops]);
  const completedCrops = useMemo(() => crops.filter(c => c.currentStage === 'completed'), [crops]);

  const allActivities = useMemo(() => {
    return crops
      .flatMap(c => c.activities)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [crops]);

  return {
    crops,
    activeCrops,
    completedCrops,
    allActivities,
    isLoading: cropsQuery.isLoading,
    addCrop,
    updateCrop,
    deleteCrop,
    updateStage,
    addActivity,
    getCropById,
  };
});
