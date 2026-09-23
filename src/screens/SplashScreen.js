import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SplashScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>F1</Text>
        </View>
        
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="flag-checkered" size={32} color={COLORS.primary} />
          <Text style={styles.appTitle}>FORMULA 1</Text>
        </View>
        
        <Text style={styles.subtitle}>Vive la pasión por la velocidad</Text>
        
        <View style={styles.loadingIndicator}>
          <View style={styles.redBar} />
        </View>
      </Animated.View>

      <Text style={styles.footerText}>UNIVERSIDAD TECNOLÓGICA DE CANCÚN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  logoBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  logoText: {
    color: COLORS.text,
    fontSize: 54,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  appTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  loadingIndicator: {
    width: 120,
    height: 4,
    backgroundColor: COLORS.surfaceCard,
    borderRadius: 2,
    overflow: 'hidden',
  },
  redBar: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    color: COLORS.textSecondary,
    fontSize: 12,
    letterSpacing: 2,
  },
});
