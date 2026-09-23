import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';

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
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../../assets/f1_logo.png')}
          style={styles.f1LogoImage}
          resizeMode="contain"
        />
        
        <Text style={styles.appTitle}>FORMULA 1</Text>
        <Text style={styles.subtitle}>Vive la pasión por la velocidad</Text>
        
        <View style={styles.loadingIndicator}>
          <View style={styles.redBar} />
        </View>
      </Animated.View>

      <Text style={styles.footerText}>UNIVERSIDAD TECNOLÓGICA DE CANCÚN</Text>
    </SafeAreaView>
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
  f1LogoImage: {
    width: 220,
    height: 90,
    marginBottom: 20,
  },
  appTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 6,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  loadingIndicator: {
    width: 140,
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
