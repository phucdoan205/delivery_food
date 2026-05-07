import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000' }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>THE CULINARY CURATOR</Text>
            </View>

            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>🍴</Text>
              </View>
            </View>

            <Text style={styles.title}>Crave & Co.</Text>
            <Text style={styles.subtitle}>
              Trải nghiệm nghệ thuật ẩm thực, được giao đến tận cửa nhà bạn với sự chăm sóc tỉ mỉ.
            </Text>

            <View style={styles.tagContainer}>
              <View style={[styles.tag, { backgroundColor: '#2ECC7120' }]}>
                <Text style={[styles.tagText, { color: '#2ECC71' }]}>🌿 Hữu cơ</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: '#F1C40F20' }]}>
                <Text style={[styles.tagText, { color: '#F1C40F' }]}>⚡ Giao nhanh</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <CustomButton
                title="Bắt đầu ngay"
                onPress={() => navigation.navigate('Login')}
                icon={ArrowRight}
                style={styles.button}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Đăng nhập vào tài khoản của bạn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 30,
  },
  content: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 30,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 8,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  tag: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
  loginText: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 20,
    fontSize: 14,
    fontWeight: '600',
  }
});

export default OnboardingScreen;
