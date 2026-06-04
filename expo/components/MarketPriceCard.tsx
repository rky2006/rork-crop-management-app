import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { getLiveMandiPrice, getMarketPrice, formatPriceRange, type LiveMandiPrice } from '@/mocks/marketPrices';

interface Props {
  cropName: string;
}

export default function MarketPriceCard({ cropName }: Props) {
  const price = useMemo(() => getMarketPrice(cropName), [cropName]);
  const [liveMandiPrice, setLiveMandiPrice] = useState<LiveMandiPrice | null>(null);

  useEffect(() => {
    let active = true;

    if (!price || price.unit !== 'per_quintal') {
      setLiveMandiPrice(null);
      return () => {
        active = false;
      };
    }

    getLiveMandiPrice(cropName).then(result => {
      if (active) setLiveMandiPrice(result);
    });

    return () => {
      active = false;
    };
  }, [cropName, price]);

  if (!price) return null;

  const mandiRange = liveMandiPrice
    ? `₹${liveMandiPrice.mandiMin.toLocaleString('en-IN')} – ₹${liveMandiPrice.mandiMax.toLocaleString('en-IN')}/qtl`
    : formatPriceRange(price);
  const mandiLabel = liveMandiPrice ? 'Live Mandi Price' : 'Typical Mandi Price';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Market Price Reference</Text>
      <View style={styles.row}>
        {price.msp !== undefined && (
          <View style={styles.cell}>
            <Text style={styles.cellLabel}>Govt. MSP / FRP</Text>
            <Text style={[styles.cellValue, { color: Colors.primary }]}>
              ₹{price.msp.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.cellSub}>per quintal</Text>
          </View>
        )}
        <View style={[styles.cell, price.msp !== undefined && styles.cellRight]}>
          <Text style={styles.cellLabel}>{mandiLabel}</Text>
          <Text style={[styles.cellValue, { color: Colors.accent }]}>
            {mandiRange}
          </Text>
          {liveMandiPrice ? (
            <Text style={styles.cellSub}>
              {liveMandiPrice.market}, {liveMandiPrice.district}
            </Text>
          ) : (
            price.season && <Text style={styles.cellSub}>{price.season} season</Text>
          )}
        </View>
      </View>
      {price.note && (
        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>💡 {price.note}</Text>
        </View>
      )}
      <Text style={styles.footer}>
        {liveMandiPrice
          ? `Live mandi data fetched from data.gov.in (${liveMandiPrice.state}).`
          : 'Prices are indicative mandi averages. Check '}
        {!liveMandiPrice && <Text style={styles.footerHighlight}>e-NAM (enam.gov.in)</Text>}
        {!liveMandiPrice && ' for live rates before selling.'}
      </Text>
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
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  cell: {
    flex: 1,
    gap: 2,
  },
  cellRight: {
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
  },
  cellLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  cellValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  cellSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  noteBanner: {
    backgroundColor: Colors.warningBg,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
  },
  noteText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
  footer: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  footerHighlight: {
    color: Colors.info,
    fontWeight: '600',
  },
});
