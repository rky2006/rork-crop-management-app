import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Check, Globe2, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageMenu() {
  const [visible, setVisible] = useState(false);
  const { language, languages, setLanguage, t } = useLanguage();
  const selectedLanguage = languages.find(option => option.code === language) ?? languages[0];

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setVisible(true)}
        activeOpacity={0.75}
      >
        <Globe2 size={16} color={Colors.primary} />
        <Text style={styles.triggerText}>{selectedLanguage.shortLabel}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <View style={styles.header}>
              <Text style={styles.title}>{t('common.selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setVisible(false)} activeOpacity={0.75}>
                <X size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {languages.map(option => {
              const isSelected = option.code === language;

              return (
                <TouchableOpacity
                  key={option.code}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => {
                    setLanguage(option.code);
                    setVisible(false);
                  }}
                  activeOpacity={0.75}
                >
                  <View>
                    <Text style={styles.optionTitle}>{option.nativeLabel}</Text>
                    <Text style={styles.optionSubtitle}>{option.englishLabel}</Text>
                  </View>
                  {isSelected ? (
                    <View style={styles.checkBadge}>
                      <Check size={14} color="#fff" />
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: Colors.primary + '12',
  },
  triggerText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700' as const,
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 10,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  optionSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
