import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
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

        <View style={styles.f1Badge}>
          <Text style={styles.f1Text}>F1</Text>
        </View>

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
          <Text style={styles.statsSectionTitle}>Estadísticas Temporada 2026</Text>

          {/* Grid Cards */}
          {isDriver ? (
            <View style={styles.gridContainer}>
              <View style={styles.gridRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statCardLabel}>VICTORIAS</Text>
                  <Text style={styles.statCardValue}>{item.wins ?? 0}</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statCardLabel}>PODIOS</Text>
                  <Text style={styles.statCardValue}>{item.podiums ?? 0}</Text>
                </View>
              </View>

              <View style={styles.gridRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statCardLabel}>PUNTOS</Text>
                  <Text style={styles.statCardValue}>{item.points ?? 0}</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statCardLabel}>POSICIÓN</Text>
                  <Text style={styles.statCardValue}>{item.pos ? `${item.pos}°` : '-'}</Text>
                </View>
              </View>

              <View style={[styles.gridRow, { justifyContent: 'center' }]}>
                <View style={[styles.statCard, { width: '60%' }]}>
                  <Text style={styles.statCardLabel}>CAMPEONATOS</Text>
                  <Text style={styles.statCardValue}>{item.titles ?? 0}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              <View style={styles.gridRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statCardLabel}>PUNTOS</Text>
                  <Text style={styles.statCardValue}>{item.points ?? 0}</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statCardLabel}>POSICIÓN</Text>
                  <Text style={styles.statCardValue}>{item.pos ? `${item.pos}°` : '-'}</Text>
                </View>
              </View>

              <View style={[styles.gridRow, { justifyContent: 'center' }]}>
                <View style={[styles.statCard, { width: '60%' }]}>
                  <Text style={styles.statCardLabel}>CAMPEONATOS</Text>
                  <Text style={styles.statCardValue}>{item.titles ?? 0}</Text>
                </View>
              </View>
            </View>
          )}
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
    paddingTop: 16,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  f1Badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  f1Text: {
    color: COLORS.text,
    fontWeight: '900',
    fontStyle: 'italic',
    fontSize: 20,
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
    fontSize: 14,
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
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  statCardValue: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '900',
  },
  errorText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});
