import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface CalendarPickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default React.memo(function CalendarPicker({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  minDate,
  maxDate,
}: CalendarPickerProps) {
  const [visible, setVisible] = useState(false);

  const initialDate = useMemo(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  }, [value]);

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const selectedParts = useMemo(() => {
    if (!value) return null;
    const d = new Date(value + 'T00:00:00');
    if (isNaN(d.getTime())) return null;
    return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
  }, [value]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days: Array<{ day: number; month: number; year: number; isCurrentMonth: boolean; disabled: boolean }> = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const m = viewMonth - 1;
      const y = m < 0 ? viewYear - 1 : viewYear;
      const actualMonth = m < 0 ? 11 : m;
      days.push({ day: d, month: actualMonth, year: y, isCurrentMonth: false, disabled: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      let disabled = false;
      const dateStr = toDateString(viewYear, viewMonth, d);
      if (minDate && dateStr < minDate) disabled = true;
      if (maxDate && dateStr > maxDate) disabled = true;
      days.push({ day: d, month: viewMonth, year: viewYear, isCurrentMonth: true, disabled });
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth + 1;
      const y = m > 11 ? viewYear + 1 : viewYear;
      const actualMonth = m > 11 ? 0 : m;
      days.push({ day: d, month: actualMonth, year: y, isCurrentMonth: false, disabled: true });
    }

    return days;
  }, [viewYear, viewMonth, minDate, maxDate]);

  const goToPrevMonth = useCallback(() => {
    setViewMonth(prev => {
      if (prev === 0) {
        setViewYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewMonth(prev => {
      if (prev === 11) {
        setViewYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const handleDayPress = useCallback((day: number) => {
    const dateStr = toDateString(viewYear, viewMonth, day);
    onChange(dateStr);
    setVisible(false);
  }, [viewYear, viewMonth, onChange]);

  const openPicker = useCallback(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
    setVisible(true);
  }, [value]);

  const today = useMemo(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  }, []);

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={openPicker}
        activeOpacity={0.7}
        testID="calendar-picker-trigger"
      >
        <Calendar size={18} color={Colors.primary} />
        <Text style={[styles.triggerText, !value && styles.placeholderText]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.calendarContainer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.header}>
              <TouchableOpacity onPress={goToPrevMonth} style={styles.navButton} activeOpacity={0.6}>
                <ChevronLeft size={22} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.monthYearText}>
                {MONTHS[viewMonth]} {viewYear}
              </Text>
              <TouchableOpacity onPress={goToNextMonth} style={styles.navButton} activeOpacity={0.6}>
                <ChevronRight size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.weekRow}>
              {DAYS.map(d => (
                <View key={d} style={styles.weekCell}>
                  <Text style={styles.weekText}>{d}</Text>
                </View>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {calendarDays.map((item, index) => {
                const isSelected =
                  selectedParts &&
                  item.isCurrentMonth &&
                  selectedParts.year === item.year &&
                  selectedParts.month === item.month &&
                  selectedParts.day === item.day;

                const isToday =
                  item.isCurrentMonth &&
                  today.year === item.year &&
                  today.month === item.month &&
                  today.day === item.day;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      isSelected && styles.selectedDay,
                      isToday && !isSelected && styles.todayDay,
                    ]}
                    onPress={() => {
                      if (item.isCurrentMonth && !item.disabled) {
                        handleDayPress(item.day);
                      }
                    }}
                    disabled={!item.isCurrentMonth || item.disabled}
                    activeOpacity={0.6}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        !item.isCurrentMonth && styles.otherMonthText,
                        item.disabled && item.isCurrentMonth && styles.disabledText,
                        isSelected && styles.selectedDayText,
                        isToday && !isSelected && styles.todayText,
                      ]}
                    >
                      {item.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.todayButton}
                onPress={() => {
                  const now = new Date();
                  setViewYear(now.getFullYear());
                  setViewMonth(now.getMonth());
                  const dateStr = toDateString(now.getFullYear(), now.getMonth(), now.getDate());
                  onChange(dateStr);
                  setVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  triggerText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  placeholderText: {
    color: Colors.textMuted,
    fontWeight: '400' as const,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthYearText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  otherMonthText: {
    color: Colors.borderLight,
  },
  disabledText: {
    color: Colors.border,
  },
  selectedDay: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '700' as const,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 100,
  },
  todayText: {
    color: Colors.primary,
    fontWeight: '700' as const,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary + '14',
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
});
