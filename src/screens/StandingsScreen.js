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
import { fetchDrivers } from '../api/openf1';

export const INITIAL_DRIVERS = [
  { id: '1', pos: 1, name: 'Max Verstappen', full_name: 'Max Verstappen', team: 'Red Bull Racing', country: 'Países Bajos', country_code: 'NED', time: '1:34:23.754', points: 437, wins: 19, podiums: 21, titles: 3, number: 1, headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col/image.png' },
  { id: '4', pos: 2, name: 'Lando Norris', full_name: 'Lando Norris', team: 'McLaren', country: 'Reino Unido', country_code: 'GBR', time: '+4.351s', points: 374, wins: 3, podiums: 12, titles: 0, number: 4, headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col/image.png' },
  { id: '16', pos: 3, name: 'Charles Leclerc', full_name: 'Charles Leclerc', team: 'Ferrari', country: 'Mónaco', country_code: 'MON', time: '+5.089s', points: 356, wins: 3, podiums: 11, titles: 0, number: 16, headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col/image.png' },
  { id: '63', pos: 4, name: 'George Russell', full_name: 'George Russell', team: 'Mercedes', country: 'Reino Unido', country_code: 'GBR', time: '+29.116s', points: 298, wins: 2, podiums: 8, titles: 0, number: 63, headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/2col/image.png' },
  { id: '12', pos: 5, name: 'K. Antonelli', full_name: 'Andrea Kimi Antonelli', team: 'Mercedes', country: 'Italia', country_code: 'ITA', time: '+29.829s', points: 245, wins: 1, podiums: 2, titles: 0, number: 12, headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KIMANT01_Kimi_Antonelli/kimant01.png.transform/2col/image.png' },
  { id: '14', pos: 6, name: 'Fernando Alonso', full_name: 'Fernando Alonso', team: 'Aston Martin', country: 'España', country_code: 'ESP', time: '+45.112s', points: 190, wins: 32, podiums: 106, titles: 2, number: 14, headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/2col/image.png' },
  { id: '55', pos: 7, name: 'Carlos Sainz', full_name: 'Carlos Sainz', team: 'Williams', country: 'España', country_code: 'ESP', time: '+50.500s', points: 175, wins: 4, podiums: 25, titles: 0, number: 55, headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col/image.png' },
  { id: '43', pos: 8, name: 'Franco Colapinto', full_name: 'Franco Colapinto', team: 'McLaren', country: 'Argentina', country_code: 'ARG', time: '+64.281s', points: 110, wins: 0, podiums: 1, titles: 0, number: 43, headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png.transform/2col/image.png' },
  { id: '11', pos: 9, name: 'Sergio Perez', full_name: 'Sergio Perez', team: 'Cadillac', country: 'México', country_code: 'MEX', time: '+75.300s', points: 95, wins: 6, podiums: 39, titles: 0, number: 11, headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/2col/image.png' },
  { id: '30', pos: 10, name: 'Liam Lawson', full_name: 'Liam Lawson', team: 'Red Bull Racing', country: 'Nueva Zelanda', country_code: 'NZL', time: '+86.746s', points: 80, wins: 0, podiums: 1, titles: 0, number: 30, headshot_url: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png.transform/2col/image.png' },
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
        // Merge OpenF1 drivers with fallback data if missing items
        const mergedMap = new Map();
        INITIAL_DRIVERS.forEach(d => mergedMap.set(d.id, d));
        apiDrivers.forEach(d => {
          const existing = mergedMap.get(d.id);
          mergedMap.set(d.id, {
            ...existing,
            ...d,
            headshot_url: d.headshot_url || existing?.headshot_url || null,
          });
        });

        const listArray = Array.from(mergedMap.values());
        const sorted = listArray.sort((a, b) => b.points - a.points);
        const mapped = sorted.map((d, idx) => ({
          ...d,
          pos: idx + 1,
          time: d.time || `+${(idx * 3.421 + 2.1).toFixed(3)}s`,
        }));
        setDriversList(mapped);
      }
    } catch (err) {
      // Keep initial drivers list
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
    'Estados Unidos',
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
    if (t === 'estados unidos') {
      return c.includes('estados unidos') || c.includes('usa') || code === 'usa' || code === 'us';
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
