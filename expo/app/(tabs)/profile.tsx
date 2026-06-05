import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { User, Languages, LogOut, ChevronRight, MapPin, Phone, Camera } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/utils/i18n';

export default function ProfileScreen() {
  const { username, language, logout, location, profileImage, setProfileImage } = useUser();
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      t.profile.logout,
      t.profile.logoutConfirm,
      [
        { text: t.profile.cancel, style: 'cancel' },
        {
          text: t.profile.logout,
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          }
        },
      ]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.diseaseDiagnosis.permissionTitle, t.diseaseDiagnosis.galleryPermission);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleChangeLanguage = () => {
    router.push('/language');
  };

  const handleContactExpert = () => {
    const phoneNumber = '18001801551';
    const telUrl = `tel:${phoneNumber}`;

    Linking.openURL(telUrl).catch(() => {
      Alert.alert(
        t.profile.support,
        (language === 'hi' ? 'कृपया इस टोल-फ्री नंबर पर कॉल करें: ' : 'Please call this toll-free number: ') + phoneNumber
      );
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage} activeOpacity={0.8}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <User size={40} color={Colors.primary} />
            )}
          </View>
          <View style={styles.cameraIconBadge}>
            <Camera size={14} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.username}>{username || (language === 'hi' ? 'किसान' : 'Kishan')}</Text>
        <View style={styles.locationBadge}>
          <MapPin size={14} color={Colors.textSecondary} />
          <Text style={styles.locationText}>{location || (language === 'hi' ? 'स्थान सेट नहीं है' : 'Location not set')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.profile.settings}</Text>

        <TouchableOpacity style={styles.menuItem} onPress={handleChangeLanguage}>
          <View style={[styles.iconWrapper, { backgroundColor: '#F0F7FE' }]}>
            <Languages size={20} color={Colors.info} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>{t.profile.language}</Text>
            <Text style={styles.menuSubtext}>{language === 'hi' ? 'हिंदी' : 'English'}</Text>
          </View>
          <ChevronRight size={20} color={Colors.border} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleContactExpert}>
          <View style={[styles.iconWrapper, { backgroundColor: '#FEF9EF' }]}>
            <Phone size={20} color={Colors.accent} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>{t.profile.support}</Text>
            <Text style={styles.menuSubtext}>{t.profile.contactExpert}</Text>
          </View>
          <ChevronRight size={20} color={Colors.border} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>{t.profile.logout}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary + '20',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraIconBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  menuSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFE3E3',
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.danger,
  },
  versionText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 40,
    marginBottom: 30,
  },
});
