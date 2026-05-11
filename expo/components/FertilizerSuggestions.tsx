import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlaskConical, Leaf, ChevronDown, ChevronUp, AlertTriangle, Info, Beaker, Bug } from 'lucide-react-native';
import { Crop } from '@/types/crop';
import { getFertilizerSuggestions, getSoilHealthSummary, FertilizerSuggestion } from '@/mocks/fertilizerSuggestions';
import Colors from '@/constants/colors';

interface FertilizerSuggestionsProps {
  crop: Crop;
}

const PRIORITY_CONFIG = {
  high: { color: '#DC2626', bgColor: '#FEF2F2', label: 'Critical' },
  medium: { color: '#D97706', bgColor: '#FFFBEB', label: 'Recommended' },
  low: { color: '#0284C7', bgColor: '#F0F9FF', label: 'Optional' },
};

const TYPE_CONFIG: Record<string, { icon: typeof FlaskConical; color: string; label: string }> = {
  fertilizer: { icon: FlaskConical, color: '#16A34A', label: 'Fertilizer' },
  amendment: { icon: Beaker, color: '#8B6914', label: 'Soil Amendment' },
  micronutrient: { icon: Info, color: '#0284C7', label: 'Micronutrient' },
  bio: { icon: Leaf, color: '#059669', label: 'Bio/Organic' },
};

function SuggestionCard({ suggestion }: { suggestion: FertilizerSuggestion }) {
  const [expanded, setExpanded] = useState(false);
  const priorityConfig = PRIORITY_CONFIG[suggestion.priority];
  const typeConfig = TYPE_CONFIG[suggestion.type] ?? TYPE_CONFIG.fertilizer;
  const TypeIcon = typeConfig.icon;

  return (
    <TouchableOpacity
      style={[styles.suggestionCard, { borderLeftColor: priorityConfig.color }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardBadges}>
          <View style={[styles.badge, { backgroundColor: priorityConfig.bgColor }]}>
            <AlertTriangle size={10} color={priorityConfig.color} />
            <Text style={[styles.badgeText, { color: priorityConfig.color }]}>{priorityConfig.label}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: typeConfig.color + '14' }]}>
            <TypeIcon size={10} color={typeConfig.color} />
            <Text style={[styles.badgeText, { color: typeConfig.color }]}>{typeConfig.label}</Text>
          </View>
        </View>
        {expanded ? <ChevronUp size={16} color={Colors.textMuted} /> : <ChevronDown size={16} color={Colors.textMuted} />}
      </View>

      <Text style={styles.cardTitle}>{suggestion.title}</Text>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.cardDescription}>{suggestion.description}</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Dosage</Text>
              <Text style={styles.detailValue}>{suggestion.dosage}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Timing</Text>
              <Text style={styles.detailValue}>{suggestion.timing}</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default React.memo(function FertilizerSuggestions({ crop }: FertilizerSuggestionsProps) {
  const [showAll, setShowAll] = useState(false);

  const soilReport = crop.soilReport;
  const isOrganic = crop.farmingType === 'organic';

  const suggestions = useMemo(() => {
    if (!soilReport) return [];
    return getFertilizerSuggestions(soilReport, crop.farmingType, crop.name, crop.category, crop.currentStage);
  }, [soilReport, crop.farmingType, crop.name, crop.category, crop.currentStage]);

  const soilHealth = useMemo(() => {
    if (!soilReport) return null;
    return getSoilHealthSummary(soilReport);
  }, [soilReport]);

  const highPriority = useMemo(() => suggestions.filter(s => s.priority === 'high'), [suggestions]);
  const otherSuggestions = useMemo(() => suggestions.filter(s => s.priority !== 'high'), [suggestions]);

  if (!soilReport) return null;
  if (suggestions.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <FlaskConical size={18} color="#8B6914" />
          <Text style={styles.sectionTitle}>Fertilizer Suggestions</Text>
        </View>
        {isOrganic && (
          <View style={styles.organicBadge}>
            <Leaf size={12} color="#16A34A" />
            <Text style={styles.organicBadgeText}>Organic</Text>
          </View>
        )}
      </View>

      {soilHealth && (
        <View style={styles.healthCard}>
          <View style={styles.healthScoreRow}>
            <View style={styles.healthScoreCircle}>
              <Text style={[styles.healthScoreValue, { color: soilHealth.color }]}>{soilHealth.score}</Text>
              <Text style={styles.healthScoreLabel}>/ 100</Text>
            </View>
            <View style={styles.healthInfo}>
              <Text style={[styles.healthStatus, { color: soilHealth.color }]}>{soilHealth.label} Soil Health</Text>
              {soilHealth.issues.length > 0 && (
                <Text style={styles.healthIssues} numberOfLines={3}>
                  Issues: {soilHealth.issues.join(', ')}
                </Text>
              )}
              {soilHealth.issues.length === 0 && (
                <Text style={styles.healthGood}>All parameters within healthy range</Text>
              )}
            </View>
          </View>
          <View style={styles.healthBar}>
            <View style={[styles.healthBarFill, { width: `${soilHealth.score}%`, backgroundColor: soilHealth.color }]} />
          </View>
        </View>
      )}

      <Text style={styles.subtitle}>
        Based on your soil report {isOrganic ? '(organic inputs only)' : '(chemical + organic)'}
      </Text>

      {highPriority.length > 0 && (
        <View style={styles.prioritySection}>
          <Text style={styles.prioritySectionTitle}>Must Apply</Text>
          {highPriority.map(s => <SuggestionCard key={s.id} suggestion={s} />)}
        </View>
      )}

      {otherSuggestions.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.showMoreToggle}
            onPress={() => setShowAll(!showAll)}
            activeOpacity={0.7}
          >
            <Text style={styles.showMoreText}>
              {showAll ? 'Hide' : 'Show'} {otherSuggestions.length} more suggestions
            </Text>
            {showAll ? <ChevronUp size={16} color={Colors.primary} /> : <ChevronDown size={16} color={Colors.primary} />}
          </TouchableOpacity>

          {showAll && otherSuggestions.map(s => <SuggestionCard key={s.id} suggestion={s} />)}
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  organicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  organicBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#16A34A',
  },
  healthCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  healthScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  healthScoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthScoreValue: {
    fontSize: 22,
    fontWeight: '800' as const,
  },
  healthScoreLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: -2,
  },
  healthInfo: {
    flex: 1,
  },
  healthStatus: {
    fontSize: 15,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  healthIssues: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  healthGood: {
    fontSize: 12,
    color: '#059669',
  },
  healthBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  prioritySection: {
    marginBottom: 4,
  },
  prioritySectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#DC2626',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  suggestionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardBadges: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  cardDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 10,
  },
  detailRow: {
    marginBottom: 6,
  },
  detailItem: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  showMoreToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 4,
  },
  showMoreText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});
