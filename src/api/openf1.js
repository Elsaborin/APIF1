import axios from 'axios';

const BASE_URL = 'https://api.openf1.org/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Official 22 F1 Drivers static metadata mapping (Country, Stats & High-Res Headshots)
const DRIVER_METADATA = {
  1: { full_name: 'Lando Norris', country: 'Reino Unido', country_code: 'GBR', points: 437, wins: 19, podiums: 21, titles: 1 },
  3: { full_name: 'Max Verstappen', country: 'Países Bajos', country_code: 'NED', points: 374, wins: 3, podiums: 14, titles: 4 },
  16: { full_name: 'Charles Leclerc', country: 'Mónaco', country_code: 'MON', points: 356, wins: 3, podiums: 11, titles: 0 },
  63: { full_name: 'George Russell', country: 'Reino Unido', country_code: 'GBR', points: 298, wins: 2, podiums: 8, titles: 0 },
  44: { full_name: 'Lewis Hamilton', country: 'Reino Unido', country_code: 'GBR', points: 218, wins: 105, podiums: 197, titles: 7 },
  81: { full_name: 'Oscar Piastri', country: 'Australia', country_code: 'AUS', points: 210, wins: 2, podiums: 9, titles: 0 },
  12: { full_name: 'Andrea Kimi Antonelli', country: 'Italia', country_code: 'ITA', points: 195, wins: 1, podiums: 3, titles: 0 },
  55: { full_name: 'Carlos Sainz', country: 'España', country_code: 'ESP', points: 175, wins: 4, podiums: 25, titles: 0 },
  14: { full_name: 'Fernando Alonso', country: 'España', country_code: 'ESP', points: 160, wins: 32, podiums: 106, titles: 2 },
  10: { full_name: 'Pierre Gasly', country: 'Francia', country_code: 'FRA', points: 125, wins: 1, podiums: 4, titles: 0 },
  11: { full_name: 'Sergio Perez', country: 'México', country_code: 'MEX', points: 110, wins: 6, podiums: 39, titles: 0 },
  43: { full_name: 'Franco Colapinto', country: 'Argentina', country_code: 'ARG', points: 95, wins: 0, podiums: 1, titles: 0 },
  31: { full_name: 'Esteban Ocon', country: 'Francia', country_code: 'FRA', points: 88, wins: 1, podiums: 4, titles: 0 },
  27: { full_name: 'Nico Hulkenberg', country: 'Alemania', country_code: 'GER', points: 75, wins: 0, podiums: 0, titles: 0 },
  22: { full_name: 'Yuki Tsunoda', country: 'Japón', country_code: 'JPN', points: 65, wins: 0, podiums: 0, titles: 0 },
  30: { full_name: 'Liam Lawson', country: 'Nueva Zelanda', country_code: 'NZL', points: 52, wins: 0, podiums: 1, titles: 0 },
  23: { full_name: 'Alexander Albon', country: 'Tailandia', country_code: 'THA', points: 40, wins: 0, podiums: 2, titles: 0 },
  18: { full_name: 'Lance Stroll', country: 'Canadá', country_code: 'CAN', points: 32, wins: 0, podiums: 3, titles: 0 },
  5: { full_name: 'Gabriel Bortoleto', country: 'Brasil', country_code: 'BRA', points: 25, wins: 0, podiums: 0, titles: 0 },
  77: { full_name: 'Valtteri Bottas', country: 'Finlandia', country_code: 'FIN', points: 18, wins: 10, podiums: 67, titles: 0 },
  87: { full_name: 'Oliver Bearman', country: 'Reino Unido', country_code: 'GBR', points: 12, wins: 0, podiums: 0, titles: 0 },
  41: { full_name: 'Arvid Lindblad', country: 'Reino Unido', country_code: 'GBR', points: 8, wins: 0, podiums: 0, titles: 0 },
};

/**
 * Fetch the exact 22 drivers from OpenF1 API and deduplicate by driver_number
 */
export const fetchDrivers = async (sessionKey = 'latest') => {
  try {
    const response = await api.get('/drivers', {
      params: sessionKey ? { session_key: sessionKey } : {},
    });

    if (response.data && Array.isArray(response.data)) {
      const driverMap = new Map();

      response.data.forEach((d) => {
        const num = Number(d.driver_number);
        if (num && !driverMap.has(num)) {
          const meta = DRIVER_METADATA[num] || {};
          
          driverMap.set(num, {
            id: String(num),
            number: num,
            name: d.name_acronym || d.last_name || meta.full_name || 'PIL',
            full_name: meta.full_name || d.full_name || `${d.first_name || ''} ${d.last_name || ''}`.trim(),
            team: d.team_name || 'Fórmula 1',
            country: meta.country || 'Fórmula 1',
            country_code: meta.country_code || d.country_code || '',
            headshot_url: d.headshot_url || null,
            team_colour: d.team_colour ? `#${d.team_colour}` : null,
            points: meta.points ?? 10,
            wins: meta.wins ?? 0,
            podiums: meta.podiums ?? 0,
            titles: meta.titles ?? 0,
          });
        }
      });

      // Return array sorted by points descending
      return Array.from(driverMap.values()).sort((a, b) => b.points - a.points);
    }
    return [];
  } catch (error) {
    console.warn('OpenF1 fetchDrivers error:', error.message);
    throw error;
  }
};

/**
 * Calculate Teams rankings dynamically from driver points
 */
export const fetchTeamsFromDrivers = (drivers) => {
  const teamMap = new Map();

  drivers.forEach((d) => {
    const tName = d.team || 'Otros';
    if (!teamMap.has(tName)) {
      teamMap.set(tName, {
        id: `team-${tName.toLowerCase().replace(/\s+/g, '-')}`,
        name: tName,
        country: d.country,
        location: d.country,
        points: 0,
        wins: 0,
        podiums: 0,
        titles: tName === 'Ferrari' ? 16 : tName === 'McLaren' ? 8 : tName === 'Mercedes' ? 8 : tName === 'Red Bull Racing' ? 6 : 0,
      });
    }

    const tObj = teamMap.get(tName);
    tObj.points += d.points;
    tObj.wins += d.wins;
    tObj.podiums += d.podiums;
  });

  return Array.from(teamMap.values())
    .sort((a, b) => b.points - a.points)
    .map((t, index) => ({ ...t, pos: index + 1 }));
};

export const fetchSessions = async (year = 2024) => {
  try {
    const response = await api.get('/sessions', { params: { year } });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

export default api;
