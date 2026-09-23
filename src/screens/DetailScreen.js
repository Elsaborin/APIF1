import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FavoritesContext } from '../context/FavoritesContext';

export default function DetailScreen({ route, navigation }) {
  const { item, type = 'driver' } = route.params || {};

  const {
    toggleFavoriteDriver,
    toggleFavoriteTeam,
    isFavoriteDriver,
    isFavoriteTeam,
  } = useContext(FavoritesContext);

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.errorText}>No se encontraron detalles.</Text>
      </SafeAreaView>
    );
  }

  const isDriver = type === 'driver';
  const isFav = isDriver ? isFavoriteDriver(item.id) : isFavoriteTeam(item.id);

  const handleToggleFavorite = () => {
    if (isDriver) {
      toggleFavoriteDriver(item.id);
    } else {
      toggleFavoriteTeam(item.id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Image
          source={require('../../assets/f1_logo.png')}
          style={styles.f1LogoHeader}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.favHeaderBtn} onPress={handleToggleFavorite}>
          <MaterialCommunityIcons
            name={isFav ? 'star' : 'star-outline'}
            size={26}
            color={isFav ? COLORS.gold : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Main Container */}
        <View style={styles.profileCard}>
          {/* Avatar / Profile Graphic */}
          <View style={styles.imageBox}>
            {item.headshot_url ? (
              <Image source={{ uri: item.headshot_url }} style={styles.avatarImage} resizeMode="contain" />
            ) : (
              <MaterialCommunityIcons
                name={isDriver ? 'account-box' : 'shield-outline'}
                size={90}
                color={isDriver ? COLORS.textSecondary : COLORS.primary}
              />
            )}
          </View>

          {/* Name & Subtitle */}
          <Text style={styles.fullNameText}>{item.full_name || item.name}</Text>
          <Text style={styles.subText}>{isDriver ? (item.team || 'Fórmula 1') : (item.location || item.country)}</Text>

          {item.number && (
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>#{item.number}</Text>
            </View>
          )}

          {/* Section Subtitle */}
          <Text style={styles.statsSectionTitle}>Métricas Campeonato OpenF1 API</Text>

          {/* Grid Cards - 100% Real OpenF1 API Fields */}
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <View style={styles.statCard}>
                <Text style={styles.statCardLabel}>PUNTOS ACTUALES</Text>
                <Text style={styles.statCardValue}>{item.points ?? 0}</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statCardLabel}>POSICIÓN</Text>
                <Text style={styles.statCardValue}>{item.pos ? `${item.pos}°` : '-'}</Text>
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.statCard}>
                <Text style={styles.statCardLabel}>PUNTOS INICIO</Text>
                <Text style={styles.statCardValue}>{item.points_start ?? 0}</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statCardLabel}>POSICIÓN INICIO</Text>
                <Text style={styles.statCardValue}>{item.position_start ? `${item.position_start}°` : '-'}</Text>
              </View>
            </View>

            {item.session_key && (
              <View style={[styles.gridRow, { justifyContent: 'center' }]}>
                <View style={[styles.statCard, { width: '80%' }]}>
                  <Text style={styles.statCardLabel}>CÓDIGO SESIÓN OPENF1</Text>
                  <Text style={[styles.statCardValue, { fontSize: 20 }]}>{item.session_key}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  f1LogoHeader: {
    width: 65,
    height: 30,
  },
  favHeaderBtn: {
    padding: 8,
  },
  scrollContent: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageBox: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  fullNameText: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 12,
  },
  numberBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  numberBadgeText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsSectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  gridContainer: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  statCardValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
  },
  errorText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});
