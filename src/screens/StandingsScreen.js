import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchDrivers } from '../api/openf1';

export const INITIAL_DRIVERS = [
  { id: '12', pos: 1, name: 'K. Antonelli', full_name: 'Andrea Kimi Antonelli', team: 'Mercedes', country: 'Italia', time: '1:34:23.754', points: 25, wins: 1, podiums: 2, titles: 0, number: 12 },
  { id: '1', pos: 2, name: 'Max Verstappen', full_name: 'Max Verstappen', team: 'Red Bull Racing', country: 'Países Bajos', time: '+4.351s', points: 18, wins: 19, podiums: 21, titles: 3, number: 1 },
  { id: '4', pos: 3, name: 'L. Norris', full_name: 'Lando Norris', team: 'McLaren', country: 'Reino Unido', time: '+5.089s', points: 15, wins: 3, podiums: 12, titles: 0, number: 4 },
  { id: '16', pos: 4, name: 'C. Leclerc', full_name: 'Charles Leclerc', team: 'Ferrari', country: 'Mónaco', time: '+29.116s', points: 12, wins: 3, podiums: 11, titles: 0, number: 16 },
  { id: '63', pos: 5, name: 'G. Russell', full_name: 'George Russell', team: 'Mercedes', country: 'Reino Unido', time: '+29.829s', points: 10, wins: 2, podiums: 8, titles: 0, number: 63 },
  { id: '30', pos: 6, name: 'L. Lawson', full_name: 'Liam Lawson', team: 'Red Bull Racing', country: 'Nueva Zelanda', time: '+86.746s', points: 8, wins: 0, podiums: 1, titles: 0, number: 30 },
  { id: '43', pos: 7, name: 'F. Colapinto', full_name: 'Franco Colapinto', team: 'McLaren', country: 'Argentina', time: '+94.281s', points: 6, wins: 0, podiums: 1, titles: 0, number: 43 },
  { id: '14', pos: 8, name: 'F. Alonso', full_name: 'Fernando Alonso', team: 'Aston Martin', country: 'España', time: '+1:02.112s', points: 4, wins: 32, podiums: 106, titles: 2, number: 14 },
  { id: '55', pos: 9, name: 'C. Sainz', full_name: 'Carlos Sainz', team: 'Williams', country: 'España', time: '+1:10.500s', points: 2, wins: 4, podiums: 25, titles: 0, number: 55 },
  { id: '11', pos: 10, name: 'S. Perez', full_name: 'Sergio Perez', team: 'Cadillac', country: 'México', time: '+1:15.300s', points: 1, wins: 6, podiums: 39, titles: 0, number: 11 },
];

export const INITIAL_TEAMS = [
  { id: 'team-mercedes', pos: 1, name: 'Mercedes', country: 'Alemania', location: 'Brackley, United Kingdom', points: 503, wins: 8, podiums: 15, titles: 8 },
  { id: 'team-ferrari', pos: 2, name: 'Ferrari', country: 'Italia', location: 'Maranello, Italy', points: 358, wins: 5, podiums: 12, titles: 16 },
  { id: 'team-mclaren', pos: 3, name: 'McLaren', country: 'Reino Unido', location: 'Woking, United Kingdom', points: 306, wins: 4, podiums: 11, titles: 8 },
  { id: 'team-redbull', pos: 4, name: 'Red Bull Racing', country: 'Austria', location: 'Milton Keynes, United Kingdom', points: 290, wins: 7, podiums: 14, titles: 6 },
  { id: 'team-rb', pos: 5, name: 'Racing Bulls', country: 'Italia', location: 'Faenza, Italy', points: 120, wins: 0, podiums: 2, titles: 0 },
  { id: 'team-alpine', pos: 6, name: 'Alpine', country: 'Francia', location: 'Enstone, United Kingdom', points: 85, wins: 0, podiums: 1, titles: 2 },
  { id: 'team-aston', pos: 7, name: 'Aston Martin', country: 'Reino Unido', location: 'Silverstone, United Kingdom', points: 62, wins: 0, podiums: 1, titles: 0 },
  { id: 'team-haas', pos: 8, name: 'Haas', country: 'Estados Unidos', location: 'Kannapolis, United States', points: 44, wins: 0, podiums: 0, titles: 0 },
  { id: 'team-williams', pos: 9, name: 'Williams', country: 'Reino Unido', location: 'Grove, United Kingdom', points: 38, wins: 0, podiums: 0, titles: 9 },
  { id: 'team-sauber', pos: 10, name: 'Sauber', country: 'Suiza', location: 'Hinwil, Switzerland', points: 16, wins: 0, podiums: 0, titles: 0 },
];

export default function StandingsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('pilotos');
  const [selectedCountry, setSelectedCountry] = useState('Todos los Países');
  const [selectedYear, setSelectedYear] = useState('2026');
  
  const [loading, setLoading] = useState(false);
  const [driversList, setDriversList] = useState(INITIAL_DRIVERS);
  const [teamsList] = useState(INITIAL_TEAMS);

  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [yearModalVisible, setYearModalVisible] = useState(false);

  useEffect(() => {
    loadDriversFromApi();
  }, [selectedYear]);

  const loadDriversFromApi = async () => {
    try {
      setLoading(true);
      const apiDrivers = await fetchDrivers('latest');
      if (apiDrivers && apiDrivers.length > 0) {
        const sorted = [...apiDrivers].sort((a, b) => b.points - a.points);
        const mapped = sorted.map((d, idx) => ({
          ...d,
          pos: idx + 1,
          time: d.time || `+${(idx * 3.421 + 2.1).toFixed(3)}s`,
        }));
        setDriversList(mapped);
      }
    } catch (err) {
      console.log('Using default drivers list');
    } finally {
      setLoading(false);
    }
  };

  const countriesList = [
    'Todos los Países',
    'España',
    'Reino Unido',
    'Países Bajos',
    'Italia',
    'Mónaco',
    'Alemania',
    'Argentina',
    'México',
    'Francia',
    'Estados Unidos',
  ];

  const yearsList = ['2026', '2025', '2024'];

  const filteredDrivers = driversList.filter((driver) => {
    if (selectedCountry !== 'Todos los Países' && driver.country !== selectedCountry) {
      return false;
    }
    return true;
  });

  const filteredTeams = teamsList.filter((team) => {
    if (selectedCountry !== 'Todos los Países' && team.country !== selectedCountry) {
      return false;
    }
    return true;
  });

  const renderDriverItem = ({ item }) => (
    <TouchableOpacity
      style={styles.rowItem}
      onPress={() => navigation.navigate('Detail', { item, type: 'driver' })}
      activeOpacity={0.7}
    >
      <Text style={styles.posCell}>{item.pos}</Text>
      
      <View style={styles.avatarBox}>
        {item.headshot_url ? (
          <Image source={{ uri: item.headshot_url }} style={styles.headshot} resizeMode="cover" />
        ) : (
          <MaterialCommunityIcons name="account" size={24} color={COLORS.textSecondary} />
        )}
      </View>

      <View style={styles.mainCell}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.subText}>{item.team}</Text>
      </View>

      <View style={styles.statCell}>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>

      <Text style={styles.ptsCell}>{item.points}</Text>
    </TouchableOpacity>
  );

  const renderTeamItem = ({ item }) => (
    <TouchableOpacity
      style={styles.rowItem}
      onPress={() => navigation.navigate('Detail', { item, type: 'team' })}
      activeOpacity={0.7}
    >
      <Text style={styles.posCell}>{item.pos}</Text>
      
      <View style={styles.avatarBox}>
        <MaterialCommunityIcons name="shield-outline" size={22} color={COLORS.primary} />
      </View>

      <View style={styles.mainCell}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.subText}>{item.country}</Text>
      </View>

      <Text style={[styles.ptsCell, { width: 60, textAlign: 'right' }]}>{item.points}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.f1Badge}>
            <Text style={styles.f1Text}>F1</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Clasificación</Text>
      </View>

      {/* Main Tab Toggle [Pilotos / Equipos] */}
      <View style={styles.tabToggleContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'pilotos' && styles.tabButtonActive]}
          onPress={() => setActiveTab('pilotos')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'pilotos' && styles.tabButtonTextActive]}>
            Pilotos
          </Text>
          {activeTab === 'pilotos' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'equipos' && styles.tabButtonActive]}
          onPress={() => setActiveTab('equipos')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'equipos' && styles.tabButtonTextActive]}>
            Equipos
          </Text>
          {activeTab === 'equipos' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Filter Selectors Row */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterSelector}
          onPress={() => setCountryModalVisible(true)}
        >
          <Text style={styles.filterSelectorText}>{selectedCountry}</Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterSelector, { width: 100 }]}
          onPress={() => setYearModalVisible(true)}
        >
          <Text style={styles.filterSelectorText}>{selectedYear}</Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* List Header Labels */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderLabel, { width: 35 }]}>Pos.</Text>
        <Text style={[styles.tableHeaderLabel, { flex: 1, paddingLeft: 40 }]}>
          {activeTab === 'pilotos' ? 'Piloto / Escudería' : 'Equipo'}
        </Text>
        {activeTab === 'pilotos' && (
          <Text style={[styles.tableHeaderLabel, { width: 100, textAlign: 'right' }]}>
            Tiempo Retirado / PTS.
          </Text>
        )}
        {activeTab === 'equipos' && (
          <Text style={[styles.tableHeaderLabel, { width: 60, textAlign: 'right' }]}>PTS</Text>
        )}
      </View>

      {/* Standings List or Loader */}
      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Cargando clasificación OpenF1...</Text>
        </View>
      ) : activeTab === 'pilotos' ? (
        <FlatList
          data={filteredDrivers}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderDriverItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={filteredTeams}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTeamItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Country Modal */}
      <Modal visible={countryModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar País</Text>
            {countriesList.map((country) => (
              <TouchableOpacity
                key={country}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedCountry(country);
                  setCountryModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedCountry === country && { color: COLORS.primary, fontWeight: 'bold' },
                  ]}
                >
                  {country}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setCountryModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Year Modal */}
      <Modal visible={yearModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Año</Text>
            {yearsList.map((yr) => (
              <TouchableOpacity
                key={yr}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedYear(yr);
                  setYearModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedYear === yr && { color: COLORS.primary, fontWeight: 'bold' },
                  ]}
                >
                  {yr}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setYearModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: 20,
    marginBottom: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
  headerTitle: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  tabToggleContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabButton: {
    marginRight: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonActive: {},
  tabButtonText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabButtonTextActive: {
    color: COLORS.text,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -1,
    height: 3,
    width: '100%',
    backgroundColor: COLORS.text,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  filterSelector: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 140,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterSelectorText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableHeaderLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  posCell: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    width: 25,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  headshot: {
    width: '100%',
    height: '100%',
  },
  mainCell: {
    flex: 1,
  },
  nameText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  statCell: {
    alignItems: 'flex-end',
    marginRight: 16,
  },
  timeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  ptsCell: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'right',
  },
  loaderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loaderText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 30,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalOptionText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
  modalCloseBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
});
