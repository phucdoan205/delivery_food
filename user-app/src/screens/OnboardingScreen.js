import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import { Utensils } from 'lucide-react-native';

const OnboardingScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop' }}
      style={styles.container}
    >
      <View style={styles.overlay} />
      
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Utensils size={14} color={COLORS.secondary} />
            <Text style={styles.badgeText}> THE CULINARY CURATOR</Text>
          </View>
        </View>

        <View style={styles.middle}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' }} 
              style={styles.logo}
              tintColor={COLORS.primary}
            />
          </View>
          <Text style={styles.title}>Crave & Co.</Text>
          <Text style={styles.subtitle}>
            Trải nghiệm nghệ thuật ẩm thực, được giao đến tận cửa nhà bạn với sự chăm sóc tỉ mỉ.
          </Text>

          <View style={styles.features}>
            <View style={[styles.featureBadge, { backgroundColor: '#81C784' }]}>
              <Text style={styles.featureText}>🍃 Hữu cơ</Text>
            </View>
            <View style={[styles.featureBadge, { backgroundColor: '#FFD54F' }]}>
              <Text style={styles.featureText}>⚡ Giao nhanh</Text>
            </View>
            <View style={[styles.featureBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.featureText}>🎖️ Tinh tuyển</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <CustomButton 
            title="Bắt đầu ngay" 
            showArrow 
            onPress={() => navigation.navigate('Login')} 
          />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Đăng nhập vào tài khoản của bạn</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding * 1.5,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: SIZES.extraLarge,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  middle: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.padding,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.base,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SIZES.extraLarge,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  featureBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  featureText: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    marginBottom: SIZES.extraLarge,
  },
  loginLink: {
    color: COLORS.white,
    textAlign: 'center',
    marginTop: SIZES.padding,
    fontSize: SIZES.font,
    textDecorationLine: 'underline',
  }
});

export default OnboardingScreen;
