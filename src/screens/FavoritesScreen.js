import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FavoritesContext } from '../context/FavoritesContext';
import { INITIAL_DRIVERS, INITIAL_TEAMS } from './StandingsScreen';

export default function FavoritesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('pilotos');
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    toggleFavoriteDriver,
    toggleFavoriteTeam,
    isFavoriteDriver,
    isFavoriteTeam,
  } = useContext(FavoritesContext);

  const filteredDrivers = INITIAL_DRIVERS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.team.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredTeams = INITIAL_TEAMS.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderDriverCard = ({ item }) => {
    const isFav = isFavoriteDriver(item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { item, type: 'driver' })}
        activeOpacity={0.7}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconPlaceholder}>
            <MaterialCommunityIcons name="account" size={28} color={COLORS.textSecondary} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.full_name || item.name}</Text>
            <Text style={styles.cardSub}>{item.team}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.starButton}
          onPress={() => toggleFavoriteDriver(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name={isFav ? 'star' : 'star-outline'}
            size={24}
            color={isFav ? COLORS.gold : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderTeamCard = ({ item }) => {
    const isFav = isFavoriteTeam(item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { item, type: 'team' })}
        activeOpacity={0.7}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconPlaceholder}>
            <MaterialCommunityIcons name="shield-outline" size={26} color={COLORS.primary} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSub}>{item.location || item.country}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.starButton}
          onPress={() => toggleFavoriteTeam(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name={isFav ? 'star' : 'star-outline'}
            size={24}
            color={isFav ? COLORS.gold : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/f1_logo.png')}
          style={styles.f1LogoHeader}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Favoritos</Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={22} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar favoritos..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Toggle Buttons [Pilotos / Equipos] */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === 'pilotos' && styles.toggleBtnActive]}
          onPress={() => setActiveTab('pilotos')}
        >
          <Text style={[styles.toggleBtnText, activeTab === 'pilotos' && styles.toggleBtnTextActive]}>
            Pilotos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, activeTab === 'equipos' && styles.toggleBtnActive]}
          onPress={() => setActiveTab('equipos')}
        >
          <Text style={[styles.toggleBtnText, activeTab === 'equipos' && styles.toggleBtnTextActive]}>
            Equipos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section Subtitle */}
      <Text style={styles.sectionSubtitle}>Mis Favoritos</Text>

      {/* List */}
      {activeTab === 'pilotos' ? (
        <FlatList
          data={filteredDrivers}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderDriverCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron pilotos.</Text>
          }
        />
      ) : (
        <FlatList
          data={filteredTeams}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTeamCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron equipos.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 12,
  },
  f1LogoHeader: {
    width: 70,
    height: 30,
    marginBottom: 4,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  toggleBtn: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.text,
  },
  toggleBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  starButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});
