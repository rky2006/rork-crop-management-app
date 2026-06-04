import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Crop } from '@/types/crop';
import { daysFromNow } from '@/utils/helpers';
import { AlertTriangle, Clock, Activity } from 'lucide-react-native';

interface Props {
  crops: Crop[];
}

interface Alert {
  type: 'overdue' | 'soon' | 'idle';
  cropId: string;
  cropName: string;
  message: string;
}

function buildAlerts(crops: Crop[]): Alert[] {
  const now = Date.now();
  const alerts: Alert[] = [];
  const activeCrops = crops.filter(c => c.currentStage !== 'completed');

  for (const crop of activeCrops) {
    if (!crop.expectedHarvestDate) continue;
    const days = daysFromNow(crop.expectedHarvestDate);
    if (days < 0) {
      alerts.push({
        type: 'overdue',
        cropId: crop.id,
        cropName: crop.name,
        message: `${crop.plotName || crop.name} harvest is overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`,
      });
    } else if (days <= 7) {
      alerts.push({
        type: 'soon',
        cropId: crop.id,
        cropName: crop.name,
        message: `${crop.plotName || crop.name} is ready to harvest in ${days} day${days !== 1 ? 's' : ''}`,
      });
    }
  }

  // Idle crops: no activity in last 14 days
  for (const crop of activeCrops) {
    if (crop.currentStage === 'planning') continue;
    if (crop.activities.length === 0) {
      alerts.push({
        type: 'idle',
        cropId: crop.id,
        cropName: crop.name,
        message: `No activities logged for ${crop.plotName || crop.name} yet`,
      });
      continue;
    }
    const lastActivity = crop.activities.reduce((latest, a) => {
      return new Date(a.date).getTime() > new Date(latest.date).getTime() ? a : latest;
    });
    const daysSinceActivity = Math.floor((now - new Date(lastActivity.date).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceActivity >= 14) {
      alerts.push({
        type: 'idle',
        cropId: crop.id,
        cropName: crop.name,
        message: `No activity logged for ${crop.plotName || crop.name} in ${daysSinceActivity} days`,
      });
    }
  }

  // Sort: overdue first, then soon, then idle
  const order: Record<Alert['type'], number> = { overdue: 0, soon: 1, idle: 2 };
  alerts.sort((a, b) => order[a.type] - order[b.type]);

  return alerts.slice(0, 5); // cap at 5 to avoid overwhelming
}

const ALERT_STYLES: Record<Alert['type'], { bg: string; border: string; icon: React.ReactNode; label: string }> = {
  overdue: {
    bg: '#FEF2F2',
    border: '#FCA5A5',
    icon: <AlertTriangle size={15} color={Colors.danger} />,
    label: 'Overdue',
  },
  soon: {
    bg: Colors.warningBg,
    border: Colors.warningBorder,
    icon: <Clock size={15} color={Colors.warning} />,
    label: 'Harvest Soon',
  },
  idle: {
    bg: '#EFF6FF',
    border: '#BFDBFE',
    icon: <Activity size={15} color={Colors.info} />,
    label: 'Log Activities',
  },
};

export default function AlertsBanner({ crops }: Props) {
  const router = useRouter();
  const alerts = buildAlerts(crops);

  if (alerts.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔔 Smart Alerts</Text>
      {alerts.map((alert, idx) => {
        const style = ALERT_STYLES[alert.type];
        return (
          <TouchableOpacity
            key={`${alert.cropId}-${idx}`}
            style={[styles.alertCard, { backgroundColor: style.bg, borderColor: style.border }]}
            onPress={() => router.push({ pathname: '/crop-detail', params: { id: alert.cropId } })}
            activeOpacity={0.7}
          >
            <View style={styles.alertLeft}>
              {style.icon}
            </View>
            <View style={styles.alertBody}>
              <Text style={styles.alertLabel}>{style.label}</Text>
              <Text style={styles.alertMessage}>{alert.message}</Text>
            </View>
            <Text style={styles.alertChevron}>›</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  alertLeft: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBody: {
    flex: 1,
    gap: 2,
  },
  alertLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  alertMessage: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
    lineHeight: 18,
  },
  alertChevron: {
    fontSize: 20,
    color: Colors.textMuted,
    fontWeight: '300',
  },
});
