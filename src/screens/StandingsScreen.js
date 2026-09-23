import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchDrivers, fetchTeams } from '../api/openf1';

export default function StandingsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('pilotos');
  const [selectedCountry, setSelectedCountry] = useState('Todos los Países');
  const [selectedYear, setSelectedYear] = useState('2026');
  
  const [loading, setLoading] = useState(true);
  const [driversList, setDriversList] = useState([]);
  const [teamsList, setTeamsList] = useState([]);

  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [yearModalVisible, setYearModalVisible] = useState(false);

  useEffect(() => {
    loadDataFromOpenF1();
  }, [selectedYear]);

  const loadDataFromOpenF1 = async () => {
    try {
      setLoading(true);
      const [apiDrivers, apiTeams] = await Promise.all([
        fetchDrivers('latest'),
        fetchTeams('latest'),
      ]);

      const mappedDrivers = apiDrivers.map((d, idx) => ({
        ...d,
        time: d.time || `+${(idx * 2.815 + 1.254).toFixed(3)}s`,
      }));

      setDriversList(mappedDrivers);
      setTeamsList(apiTeams);
    } catch (err) {
      console.warn('Error loading OpenF1 API standings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const countriesList = [
    'Todos los Países',
    'Mónaco',
    'España',
    'Reino Unido',
    'Países Bajos',
    'Italia',
    'Argentina',
    'México',
    'Francia',
    'Alemania',
    'Brasil',
  ];

  const yearsList = ['2026', '2025', '2024'];

  const matchesCountryFilter = (itemCountry, itemCode, target) => {
    if (target === 'Todos los Países') return true;
    if (!itemCountry && !itemCode) return false;

    const t = target.toLowerCase();
    const c = (itemCountry || '').toLowerCase();
    const code = (itemCode || '').toLowerCase();

    if (t === 'mónaco' || t === 'monaco') {
      return c.includes('mónaco') || c.includes('monaco') || code === 'mon' || code === 'mc' || code === 'mco';
    }
    if (t === 'españa' || t === 'espana') {
      return c.includes('españa') || c.includes('espana') || code === 'esp' || code === 'es';
    }
    if (t === 'reino unido') {
      return c.includes('reino unido') || c.includes('uk') || code === 'gbr' || code === 'uk';
    }
    if (t === 'países bajos' || t === 'paises bajos') {
      return c.includes('países bajos') || c.includes('paises bajos') || c.includes('netherlands') || code === 'ned' || code === 'nld' || code === 'nl';
    }
    if (t === 'italia') {
      return c.includes('italia') || c.includes('italy') || code === 'ita' || code === 'it';
    }
    if (t === 'argentina') {
      return c.includes('argentina') || code === 'arg' || code === 'ar';
    }
    if (t === 'méxico' || t === 'mexico') {
      return c.includes('méxico') || c.includes('mexico') || code === 'mex' || code === 'mx';
    }
    if (t === 'francia') {
      return c.includes('francia') || c.includes('france') || code === 'fra' || code === 'fr';
    }
    if (t === 'alemania') {
      return c.includes('alemania') || c.includes('germany') || code === 'ger' || code === 'de';
    }

    return c.includes(t) || code.includes(t);
  };

  const filteredDrivers = driversList.filter((driver) =>
    matchesCountryFilter(driver.country, driver.country_code, selectedCountry)
  );

  const filteredTeams = teamsList.filter((team) =>
    matchesCountryFilter(team.country, team.country_code, selectedCountry)
  );

  const renderDriverItem = ({ item }) => (
    <TouchableOpacity
      style={styles.rowItem}
      onPress={() => navigation.navigate('Detail', { item, type: 'driver' })}
      activeOpacity={0.7}
    >
      <Text style={styles.posCell}>{item.pos}</Text>
      
      <View style={styles.avatarBox}>
        {item.headshot_url ? (
          <Image source={{ uri: item.headshot_url }} style={styles.headshot} resizeMode="contain" />
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
          <Image
            source={require('../../assets/f1_logo.png')}
            style={styles.f1LogoHeader}
            resizeMode="contain"
          />
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="account-search-outline" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No hay pilotos registrados para {selectedCountry}.</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredTeams}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTeamItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="shield-search" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No hay equipos registrados para {selectedCountry}.</Text>
            </View>
          }
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
    paddingTop: 10,
    marginBottom: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  f1LogoHeader: {
    width: 70,
    height: 30,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
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
