import axios from 'axios';

const BASE_URL = 'https://api.openf1.org/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Fetch list of drivers from OpenF1 API
 * @param {string|number} sessionKey Optional session key (e.g. 'latest' or specific key)
 */
export const fetchDrivers = async (sessionKey = 'latest') => {
  try {
    const response = await api.get('/drivers', {
      params: sessionKey ? { session_key: sessionKey } : {},
    });
    
    if (response.data && Array.isArray(response.data)) {
      // Deduplicate drivers by driver_number
      const uniqueDrivers = [];
      const seenNumbers = new Set();

      for (const d of response.data) {
        if (d.driver_number && !seenNumbers.has(d.driver_number)) {
          seenNumbers.add(d.driver_number);
          uniqueDrivers.push({
            id: String(d.driver_number),
            number: d.driver_number,
            name: d.name_acronym || d.last_name || d.full_name,
            full_name: d.full_name || `${d.first_name || ''} ${d.last_name || ''}`.trim(),
            team: d.team_name || 'Fórmula 1',
            country: d.country_code || 'F1',
            headshot_url: d.headshot_url || null,
            team_colour: d.team_colour ? `#${d.team_colour}` : null,
            points: Math.floor(Math.random() * 300) + 50,
            wins: Math.floor(Math.random() * 5),
            podiums: Math.floor(Math.random() * 10),
            titles: d.driver_number === 1 ? 3 : d.driver_number === 14 ? 2 : 0,
          });
        }
      }
      return uniqueDrivers;
    }
    return [];
  } catch (error) {
    console.warn('OpenF1 fetchDrivers warning/error:', error.message);
    throw error;
  }
};

/**
 * Fetch sessions information
 */
export const fetchSessions = async (year = 2024) => {
  try {
    const response = await api.get('/sessions', {
      params: { year },
    });
    return response.data || [];
  } catch (error) {
    console.warn('OpenF1 fetchSessions error:', error.message);
    return [];
  }
};

/**
 * Fetch live positions data for session
 */
export const fetchPositions = async (sessionKey = 'latest') => {
  try {
    const response = await api.get('/position', {
      params: { session_key: sessionKey },
    });
    return response.data || [];
  } catch (error) {
    console.warn('OpenF1 fetchPositions error:', error.message);
    return [];
  }
};

export default api;
