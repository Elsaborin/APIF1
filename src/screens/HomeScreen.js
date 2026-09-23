import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { fetchDrivers } from '../api/openf1';

const DEFAULT_TOP_TEAMS = [
  { id: 'team-mercedes', pos: 1, name: 'Mercedes', points: 503, country: 'Alemania', titles: 8 },
  { id: 'team-ferrari', pos: 2, name: 'Ferrari', points: 358, country: 'Italia', titles: 16 },
  { id: 'team-mclaren', pos: 3, name: 'McLaren', points: 306, country: 'Reino Unido', titles: 8 },
];

const DEFAULT_TOP_DRIVERS = [
  { id: '1', pos: 1, name: 'Max Verstappen', team: 'Red Bull Racing', points: 437, country: 'Países Bajos', wins: 19, podiums: 21, titles: 3, number: 1 },
  { id: '4', pos: 2, name: 'Lando Norris', team: 'McLaren', points: 374, country: 'Reino Unido', wins: 3, podiums: 12, titles: 0, number: 4 },
  { id: '16', pos: 3, name: 'Charles Leclerc', team: 'Ferrari', points: 356, country: 'Mónaco', wins: 3, podiums: 11, titles: 0, number: 16 },
];

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [topDrivers, setTopDrivers] = useState(DEFAULT_TOP_DRIVERS);
  const [topTeams] = useState(DEFAULT_TOP_TEAMS);

  const loadApiData = async () => {
    try {
      setLoading(true);
      const apiDrivers = await fetchDrivers('latest');
      if (apiDrivers && apiDrivers.length > 0) {
        // Sort and pick top 3
        const sorted = [...apiDrivers].sort((a, b) => b.points - a.points).slice(0, 3);
        const mapped = sorted.map((d, index) => ({
          ...d,
          pos: index + 1,
        }));
        setTopDrivers(mapped);
      }
    } catch (error) {
      console.log('Using default top drivers fallback');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadApiData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadApiData();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* Header F1 Branding */}
      <View style={styles.topHeader}>
        <View style={styles.f1BrandBadge}>
          <Text style={styles.f1BrandText}>F1</Text>
        </View>
        <Text style={styles.welcomeText}>Bienvenido a la F1</Text>
      </View>

      {/* Hero Title */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Vive la pasión{"\n"}por la velocidad.</Text>
        <Text style={styles.heroSub}>
          Consulta clasificaciones y los mejores destacados de la temporada
        </Text>
      </View>

      {/* Promotional Banner Card */}
      <View style={styles.promoCard}>
        <View style={styles.promoContent}>
          <Text style={styles.promoTitle}>Sigue a tus pilotos y equipos favoritos</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Clasificacion')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Ver clasificación</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.promoLogoBadge}>
          <Text style={styles.promoLogoText}>F1</Text>
        </View>
      </View>

      {/* TOP Equipos Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>TOP Equipos</Text>
        <Text style={styles.seasonBadge}>Temporada 2026</Text>
      </View>

      <View style={styles.listContainer}>
        {topTeams.map((team) => (
          <TouchableOpacity
            key={team.id}
            style={styles.listItem}
            onPress={() => navigation.navigate('Detail', { item: team, type: 'team' })}
            activeOpacity={0.7}
          >
            <Text style={styles.posText}>{team.pos}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{team.name}</Text>
              <Text style={styles.itemSub}>{team.country}</Text>
            </View>
            <Text style={styles.ptsText}>{team.points} pts</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TOP Pilotos Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>TOP Pilotos</Text>
        <Text style={styles.seasonBadge}>Temporada 2026</Text>
      </View>

      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Cargando datos OpenF1...</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {topDrivers.map((driver) => (
            <TouchableOpacity
              key={driver.id}
              style={styles.listItem}
              onPress={() => navigation.navigate('Detail', { item: driver, type: 'driver' })}
              activeOpacity={0.7}
            >
              <Text style={styles.posText}>{driver.pos}</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{driver.full_name || driver.name}</Text>
                <Text style={styles.itemSub}>{driver.team}</Text>
              </View>
              <Text style={styles.ptsText}>{driver.points} pts</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 50,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  f1BrandBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  f1BrandText: {
    color: COLORS.text,
    fontWeight: '900',
    fontStyle: 'italic',
    fontSize: 16,
  },
  welcomeText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  heroSection: {
    marginBottom: 20,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
    marginBottom: 8,
  },
  heroSub: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  promoCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  promoContent: {
    flex: 1,
    paddingRight: 15,
  },
  promoTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  actionButtonText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  promoLogoBadge: {
    width: 65,
    height: 65,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  promoLogoText: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 10,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  seasonBadge: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  listContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  posText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  ptsText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  loaderBox: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    color: COLORS.textSecondary,
    marginTop: 10,
    fontSize: 13,
  },
});
