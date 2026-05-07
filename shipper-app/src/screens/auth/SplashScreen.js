import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop' }} 
        style={StyleSheet.absoluteFillObject}
      />
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png' }} 
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Crave & Co.</Text>
        <Text style={styles.subtitle}>
          Trải nghiệm nghệ thuật ẩm thực,{"\n"}
          được giao đến tận cửa nhà bạn với{"\n"}
          sự chăm sóc tỉ mỉ.
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 2,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.padding,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.white,
    fontSize: 42,
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
});

export default SplashScreen;
