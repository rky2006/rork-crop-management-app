import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Droplets, Bug, Scissors, Sprout, Eye, Shovel, CircleDot, Zap, Trash2 } from 'lucide-react-native';
import { useCrops } from '@/contexts/CropContext';
import { CropActivity, ACTIVITY_LABELS, ActivityType } from '@/types/crop';
import { formatDate } from '@/utils/helpers';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';

const ACTIVITY_ICONS: Record<ActivityType, React.ReactNode> = {
  sowing: <Sprout size={18} color="#8B6914" />,
  watering: <Droplets size={18} color="#0284C7" />,
  fertilizing: <Zap size={18} color="#16A34A" />,
  pesticide: <Bug size={18} color="#DC2626" />,
  weeding: <Shovel size={18} color="#D97706" />,
  pruning: <Scissors size={18} color="#7C3AED" />,
  harvesting: <Sprout size={18} color="#CA8A04" />,
  inspection: <Eye size={18} color="#0891B2" />,
  other: <CircleDot size={18} color="#64748B" />,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  sowing: '#FEF3C7',
  watering: '#E0F2FE',
  fertilizing: '#DCFCE7',
  pesticide: '#FEE2E2',
  weeding: '#FEF3C7',
  pruning: '#EDE9FE',
  harvesting: '#FEF9C3',
  inspection: '#CFFAFE',
  other: '#F1F5F9',
};

interface GroupedActivity {
  date: string;
  activities: (CropActivity & { cropName: string })[];
}

export default function ActivitiesScreen() {
  const { crops, allActivities, deleteActivity } = useCrops();

  const groupedActivities = useMemo(() => {
    const withCropName = allActivities.map(a => {
      const crop = crops.find(c => c.id === a.cropId);
      return { ...a, cropName: crop?.name ?? 'Unknown' };
    });

    const grouped: Record<string, (CropActivity & { cropName: string })[]> = {};
    withCropName.forEach(a => {
      const dateKey = new Date(a.date).toISOString().split('T')[0];
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(a);
    });

    return Object.entries(grouped)
      .map(([date, activities]) => ({ date, activities }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allActivities, crops]);

  const totalCost = useMemo(() => {
    return allActivities.reduce((sum, a) => sum + (a.cost || 0), 0);
  }, [allActivities]);

  if (allActivities.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="No Activities Yet"
          subtitle="Log your farming activities like watering, fertilizing, and more to keep track of your progress."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {totalCost > 0 && (
        <View style={styles.costBanner}>
          <Text style={styles.costLabel}>Total Expenses</Text>
          <Text style={styles.costValue}>₹{totalCost.toLocaleString()}</Text>
        </View>
      )}

      <FlatList
        data={groupedActivities}
        keyExtractor={item => item.date}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: group }) => (
          <View style={styles.dateGroup}>
            <Text style={styles.dateHeader}>{formatDate(group.date)}</Text>
            {group.activities.map(activity => (
              <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              onLongPress={() => {
                Alert.alert(
                  'Delete Activity',
                  `Delete "${activity.title}"?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => deleteActivity(activity.cropId, activity.id),
                    },
                  ]
                );
              }}
              activeOpacity={0.8}
              delayLongPress={500}
            >
              <View style={[styles.iconCircle, { backgroundColor: ACTIVITY_COLORS[activity.type] }]}>
                {ACTIVITY_ICONS[activity.type]}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityCrop}>{activity.cropName}</Text>
                {activity.description ? (
                  <Text style={styles.activityDesc} numberOfLines={2}>{activity.description}</Text>
                ) : null}
                <Text style={styles.longPressHint}>Long press to delete</Text>
              </View>
              <View style={styles.activityMeta}>
                <Text style={styles.activityType}>{ACTIVITY_LABELS[activity.type]}</Text>
                {activity.cost !== undefined && activity.cost > 0 && (
                  <Text style={styles.activityCostText}>₹{activity.cost}</Text>
                )}
              </View>
            </TouchableOpacity>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  costBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
  },
  costLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500' as const,
  },
  costValue: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#fff',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  activityCrop: {
    fontSize: 12,
    color: Colors.primaryLight,
    fontWeight: '500' as const,
    marginTop: 1,
  },
  activityDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
  },
  longPressHint: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 3,
    fontStyle: 'italic',
  },
  activityMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  activityType: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  activityCostText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.accent,
    marginTop: 4,
  },
});
