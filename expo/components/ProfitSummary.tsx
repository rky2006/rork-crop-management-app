import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { Crop, YIELD_UNIT_SHORT } from '@/types/crop';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface Props {
  crop: Crop;
}

function getTotalExpenses(crop: Crop): number {
  return crop.activities.reduce((sum, a) => sum + (a.cost ?? 0), 0);
}

function getExpectedRevenue(crop: Crop): number | null {
  const yieldQty = parseFloat(crop.expectedYield ?? '');
  const price = parseFloat(crop.sellingPricePerUnit ?? '');
  if (!isFinite(yieldQty) || !isFinite(price)) return null;
  return yieldQty * price;
}

export default function ProfitSummary({ crop }: Props) {
  const totalExpenses = getTotalExpenses(crop);
  const expectedRevenue = getExpectedRevenue(crop);
  const hasYieldData = expectedRevenue !== null;
  const netProfit = hasYieldData ? expectedRevenue! - totalExpenses : null;

  const yieldUnitShort = YIELD_UNIT_SHORT[crop.yieldUnit ?? 'quintal'];

  const fmtINR = (n: number) =>
    '₹' + Math.round(Math.abs(n)).toLocaleString('en-IN');

  let profitIcon = <Minus size={16} color={Colors.textSecondary} />;
  let profitColor = Colors.textSecondary;
  let profitBg = Colors.surfaceAlt;
  if (netProfit !== null) {
    if (netProfit > 0) {
      profitIcon = <TrendingUp size={16} color={Colors.success} />;
      profitColor = Colors.success;
      profitBg = '#ECFDF5';
    } else if (netProfit < 0) {
      profitIcon = <TrendingDown size={16} color={Colors.danger} />;
      profitColor = Colors.danger;
      profitBg = '#FEF2F2';
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Profit Tracker</Text>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>Total Expenses</Text>
          <Text style={[styles.cellValue, { color: Colors.danger }]}>
            {totalExpenses > 0 ? fmtINR(totalExpenses) : '—'}
          </Text>
          {totalExpenses > 0 && (
            <Text style={styles.cellSub}>from {crop.activities.filter(a => (a.cost ?? 0) > 0).length} activities</Text>
          )}
        </View>
        <View style={styles.divider} />
        <View style={styles.cell}>
          <Text style={styles.cellLabel}>Expected Revenue</Text>
          {hasYieldData ? (
            <>
              <Text style={[styles.cellValue, { color: Colors.primaryLight }]}>
                {fmtINR(expectedRevenue!)}
              </Text>
              <Text style={styles.cellSub}>
                {crop.expectedYield} {yieldUnitShort} × {fmtINR(parseFloat(crop.sellingPricePerUnit!))}/{yieldUnitShort}
              </Text>
            </>
          ) : (
            <Text style={styles.noData}>Add yield &amp; price in edit</Text>
          )}
        </View>
      </View>
      {(hasYieldData || totalExpenses > 0) && (
        <View style={[styles.profitBadge, { backgroundColor: profitBg }]}>
          {profitIcon}
          {netProfit !== null ? (
            <Text style={[styles.profitText, { color: profitColor }]}>
              {netProfit >= 0 ? 'Est. Profit: ' : 'Est. Loss: '}
              <Text style={styles.profitAmount}>{fmtINR(netProfit)}</Text>
            </Text>
          ) : (
            <Text style={[styles.profitText, { color: Colors.textSecondary }]}>
              Add expected yield &amp; selling price to calculate profit
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cell: {
    flex: 1,
    gap: 2,
  },
  cellLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  cellValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  cellSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    alignSelf: 'stretch',
  },
  profitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
  },
  profitText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  profitAmount: {
    fontWeight: '800',
  },
  noData: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
