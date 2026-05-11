import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, Info, ChevronDown, ChevronUp, Lightbulb, ArrowRight, Sprout, BookOpen } from 'lucide-react-native';
import { GrowthStage, CropCategory } from '@/types/crop';
import { getTipsForStage, FarmingTip } from '@/mocks/farmingTips';
import { getCropSpecificTips, getUpcomingCropTips, hasCropSpecificTips, CropSpecificTip } from '@/mocks/cropSpecificTips';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';
import { getStageLabel } from '@/constants/localization';

interface FarmingTipsProps {
  currentStage: GrowthStage;
  category?: CropCategory;
  cropName?: string;
}

const PRIORITY_CONFIG = {
  high: { color: '#DC2626', bgColor: '#FEF2F2', labelKey: 'farmingTips.important', icon: AlertTriangle },
  medium: { color: '#D97706', bgColor: '#FFFBEB', labelKey: 'farmingTips.recommended', icon: Info },
  low: { color: '#0284C7', bgColor: '#F0F9FF', labelKey: 'farmingTips.goodPractice', icon: Info },
};

const STAGES_ORDER: GrowthStage[] = ['planning', 'sowing', 'germination', 'vegetative', 'flowering', 'fruiting', 'ripening', 'harvest', 'completed'];

function TipCard({ tip }: { tip: FarmingTip | CropSpecificTip }) {
  const [expanded, setExpanded] = useState(false);
  const config = PRIORITY_CONFIG[tip.priority];
  const IconComponent = config.icon;
  const { t } = useLanguage();

  return (
    <TouchableOpacity
      style={[styles.tipCard, { borderLeftColor: config.color }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.tipHeader}>
        <View style={[styles.priorityBadge, { backgroundColor: config.bgColor }]}>
          <IconComponent size={12} color={config.color} />
          <Text style={[styles.priorityText, { color: config.color }]}>{t(config.labelKey)}</Text>
        </View>
        {expanded ? (
          <ChevronUp size={16} color={Colors.textMuted} />
        ) : (
          <ChevronDown size={16} color={Colors.textMuted} />
        )}
      </View>
      <Text style={styles.tipTitle}>{tip.title}</Text>
      {expanded && (
        <Text style={styles.tipDescription}>{tip.description}</Text>
      )}
    </TouchableOpacity>
  );
}

export default React.memo(function FarmingTips({ currentStage, category, cropName }: FarmingTipsProps) {
  const [showNextStage, setShowNextStage] = useState(false);
  const [showGeneralTips, setShowGeneralTips] = useState(false);
  const { language, t } = useLanguage();

  const currentIndex = STAGES_ORDER.indexOf(currentStage);
  const nextStage = currentIndex < STAGES_ORDER.length - 1 ? STAGES_ORDER[currentIndex + 1] : null;

  const hasCropTips = useMemo(() => cropName ? hasCropSpecificTips(cropName) : false, [cropName]);

  const cropCurrentTips = useMemo(() => {
    if (!cropName || !hasCropTips) return [];
    return getCropSpecificTips(cropName, currentStage);
  }, [cropName, currentStage, hasCropTips]);

  const cropNextTips = useMemo(() => {
    if (!cropName || !hasCropTips || !nextStage) return [];
    return getCropSpecificTips(cropName, nextStage);
  }, [cropName, nextStage, hasCropTips]);

  const generalCurrentTips = useMemo(() => getTipsForStage(currentStage, category), [currentStage, category]);
  const generalNextTips = useMemo(() => {
    if (!nextStage) return [];
    return getTipsForStage(nextStage, category);
  }, [nextStage, category]);

  const showCropSpecific = hasCropTips && cropCurrentTips.length > 0;

  if (cropCurrentTips.length === 0 && generalCurrentTips.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {showCropSpecific && (
        <>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Sprout size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>{t('farmingTips.cropTips', { cropName: cropName ?? '' })}</Text>
            </View>
            <View style={styles.stagePill}>
              <Text style={styles.stagePillText}>{getStageLabel(language, currentStage)}</Text>
            </View>
          </View>

          <View style={styles.cropSpecificBanner}>
            <Text style={styles.cropSpecificBannerText}>
              {t('farmingTips.specificSuggestions', { cropName: cropName ?? '', stage: getStageLabel(language, currentStage) })}
            </Text>
          </View>

          {cropCurrentTips.map(tip => (
            <TipCard key={tip.id} tip={tip} />
          ))}

          {nextStage && cropNextTips.length > 0 && (
            <>
              <TouchableOpacity
                style={styles.nextStageToggle}
                onPress={() => setShowNextStage(!showNextStage)}
                activeOpacity={0.7}
              >
                <ArrowRight size={16} color={Colors.primary} />
                <Text style={styles.nextStageToggleText}>
                  {t('farmingTips.previewCropTips', { action: showNextStage ? t('farmingTips.hideLabel') : t('farmingTips.previewLabel'), cropName: cropName ?? '', stage: getStageLabel(language, nextStage) })}
                </Text>
                {showNextStage ? (
                  <ChevronUp size={16} color={Colors.primary} />
                ) : (
                  <ChevronDown size={16} color={Colors.primary} />
                )}
              </TouchableOpacity>

              {showNextStage && (
                <View style={styles.nextStageSection}>
                  <View style={styles.nextStageBadge}>
                    <Text style={styles.nextStageBadgeText}>{t('farmingTips.comingUp', { stage: getStageLabel(language, nextStage) })}</Text>
                  </View>
                  {cropNextTips.map(tip => (
                    <TipCard key={tip.id} tip={tip} />
                  ))}
                </View>
              )}
            </>
          )}

          {generalCurrentTips.length > 0 && (
            <>
              <TouchableOpacity
                style={styles.generalToggle}
                onPress={() => setShowGeneralTips(!showGeneralTips)}
                activeOpacity={0.7}
              >
                <BookOpen size={16} color={Colors.textSecondary} />
                <Text style={styles.generalToggleText}>
                  {t('farmingTips.showGeneralTips', { action: showGeneralTips ? t('farmingTips.hideLabel') : t('farmingTips.showLabel') })}
                </Text>
                {showGeneralTips ? (
                  <ChevronUp size={16} color={Colors.textSecondary} />
                ) : (
                  <ChevronDown size={16} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>

              {showGeneralTips && (
                <View style={styles.generalSection}>
                  <View style={styles.generalBadge}>
                    <Text style={styles.generalBadgeText}>{t('farmingTips.generalTips')}</Text>
                  </View>
                  {generalCurrentTips.map(tip => (
                    <TipCard key={tip.id} tip={tip} />
                  ))}
                </View>
              )}
            </>
          )}
        </>
      )}

      {!showCropSpecific && (
        <>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Lightbulb size={18} color={Colors.accent} />
              <Text style={styles.sectionTitle}>{t('farmingTips.farmingTips')}</Text>
            </View>
            <View style={styles.stagePill}>
              <Text style={styles.stagePillText}>{getStageLabel(language, currentStage)}</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>
            {t('farmingTips.suggestionsForStage', { stage: getStageLabel(language, currentStage) })}
          </Text>

          {generalCurrentTips.map(tip => (
            <TipCard key={tip.id} tip={tip} />
          ))}

          {nextStage && generalNextTips.length > 0 && (
            <>
              <TouchableOpacity
                style={styles.nextStageToggle}
                onPress={() => setShowNextStage(!showNextStage)}
                activeOpacity={0.7}
              >
                <ArrowRight size={16} color={Colors.primary} />
                <Text style={styles.nextStageToggleText}>
                  {t('farmingTips.previewGeneralTips', { action: showNextStage ? t('farmingTips.hideLabel') : t('farmingTips.previewLabel'), stage: getStageLabel(language, nextStage) })}
                </Text>
                {showNextStage ? (
                  <ChevronUp size={16} color={Colors.primary} />
                ) : (
                  <ChevronDown size={16} color={Colors.primary} />
                )}
              </TouchableOpacity>

              {showNextStage && (
                <View style={styles.nextStageSection}>
                  <View style={styles.nextStageBadge}>
                    <Text style={styles.nextStageBadgeText}>{t('farmingTips.comingUp', { stage: getStageLabel(language, nextStage) })}</Text>
                  </View>
                  {generalNextTips.slice(0, 4).map(tip => (
                    <TipCard key={tip.id} tip={tip} />
                  ))}
                </View>
              )}
            </>
          )}
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
    marginBottom: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  stagePill: {
    backgroundColor: Colors.primary + '18',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stagePillText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  cropSpecificBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  cropSpecificBannerText: {
    fontSize: 13,
    color: Colors.primaryDark,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  tipCard: {
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
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    lineHeight: 20,
  },
  tipDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginTop: 8,
  },
  nextStageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  nextStageToggleText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
    flex: 1,
  },
  nextStageSection: {
    marginTop: 4,
  },
  nextStageBadge: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  nextStageBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  generalToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  generalToggleText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    flex: 1,
  },
  generalSection: {
    marginTop: 4,
  },
  generalBadge: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  generalBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
});
