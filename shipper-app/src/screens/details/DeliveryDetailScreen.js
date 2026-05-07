import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { currentOrder } from '../../constants/mockData';

const { width } = Dimensions.get('window');

const DeliveryDetailScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Map Preview */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop' }} 
        style={styles.map}
      />

      <Header 
        title="Giao hàng"
        style={styles.header}
        rightComponent={
          <View style={styles.incomeBadge}>
            <Text style={styles.incomeBadgeText}>$142.50</Text>
          </View>
        }
      />

      <View style={styles.topBanner}>
         <Ionicons name="arrow-undo" size={24} color={COLORS.success} />
         <View style={styles.bannerInfo}>
            <Text style={styles.bannerDistance}>450 M</Text>
            <Text style={styles.bannerText}>Rẽ phải vào Đường Lê Lợi</Text>
         </View>
      </View>

      <View style={styles.bottomContainer}>
         <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
               <View style={styles.statusRow}>
                  <View style={styles.dot} />
                  <Text style={styles.statusText}>ĐANG ĐI ĐẾN KHÁCH HÀNG</Text>
               </View>
               <View style={styles.timeBox}>
                  <Text style={styles.timeValue}>8</Text>
                  <Text style={styles.timeLabel}>Phút</Text>
                  <Text style={styles.timeEstimate}>DỰ KIẾN: 12:45</Text>
               </View>
            </View>

            <View style={styles.customerRow}>
               <Image source={{ uri: 'https://i.pravatar.cc/150?u=a' }} style={styles.customerAvatar} />
               <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{currentOrder.customer.name}</Text>
                  <Text style={styles.customerAddress} numberOfLines={1}>{currentOrder.customer.address}</Text>
               </View>
               <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                     <Ionicons name="call" size={20} color={COLORS.success} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, { marginLeft: 10, backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                     <Ionicons name="chatbubble" size={20} color={COLORS.text} />
                  </TouchableOpacity>
               </View>
            </View>

            <View style={styles.steps}>
               <View style={styles.stepItem}>
                  <View style={[styles.stepDot, { backgroundColor: COLORS.success }]}>
                     <Ionicons name="checkmark" size={12} color={COLORS.white} />
                  </View>
                  <View style={styles.stepLine} />
                  <View style={styles.stepContent}>
                     <Text style={styles.stepTitle}>Đã lấy hàng</Text>
                     <Text style={styles.stepTime}>Nhà hàng Bếp Việt • 11:30</Text>
                  </View>
               </View>
               <View style={styles.stepItem}>
                  <View style={[styles.stepDot, { backgroundColor: COLORS.primary }]}>
                     <Ionicons name="bicycle" size={12} color={COLORS.white} />
                  </View>
                  <View style={[styles.stepLine, { backgroundColor: COLORS.border }]} />
                  <View style={styles.stepContent}>
                     <Text style={styles.stepTitle}>Đang giao</Text>
                     <Text style={styles.stepTime}>Dự kiến đến lúc 11:45</Text>
                  </View>
               </View>
               <View style={styles.stepItem}>
                  <View style={[styles.stepDot, { backgroundColor: COLORS.border }]}>
                     <View style={styles.innerDot} />
                  </View>
                  <View style={styles.stepContent}>
                     <Text style={[styles.stepTitle, { color: COLORS.textLight }]}>Đã giao</Text>
                     <Text style={styles.stepTime}>Chưa hoàn thành</Text>
                  </View>
               </View>
            </View>

            <TouchableOpacity 
              style={styles.completeButton}
              onPress={() => navigation.navigate('Main')}
            >
               <View style={styles.sliderThumb}>
                  <Ionicons name="chevron-forward-outline" size={24} color={COLORS.white} />
                  <Ionicons name="chevron-forward-outline" size={24} color={COLORS.white} style={{marginLeft: -15}} />
               </View>
               <Text style={styles.completeText}>TRƯỢT ĐỂ HOÀN THÀNH</Text>
               <Ionicons name="sparkles" size={20} color={COLORS.secondary} style={styles.sparkle} />
            </TouchableOpacity>
         </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  header: {
    marginTop: 40,
    backgroundColor: 'rgba(253, 245, 242, 0.8)',
    marginHorizontal: SIZES.padding,
    borderRadius: 20,
  },
  incomeBadge: {
    backgroundColor: 'rgba(211, 84, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  incomeBadgeText: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  topBanner: {
    position: 'absolute',
    top: 120,
    left: SIZES.padding,
    right: SIZES.padding,
    backgroundColor: '#1B1B1B',
    borderRadius: 25,
    padding: SIZES.padding / 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  bannerInfo: {
    marginLeft: SIZES.padding / 2,
  },
  bannerDistance: {
    ...FONTS.h1,
    color: COLORS.white,
    fontSize: 24,
  },
  bannerText: {
    ...FONTS.body4,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: SIZES.padding,
    left: SIZES.padding,
    right: SIZES.padding,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  statusText: {
    ...FONTS.h4,
    color: COLORS.success,
    fontSize: 10,
  },
  timeBox: {
    alignItems: 'flex-end',
  },
  timeValue: {
    ...FONTS.h1,
    color: COLORS.secondary,
    fontSize: 32,
    lineHeight: 32,
  },
  timeLabel: {
    ...FONTS.h2,
    color: COLORS.secondary,
    fontSize: 18,
    marginTop: -5,
  },
  timeEstimate: {
    ...FONTS.body4,
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 84, 0, 0.03)',
    padding: SIZES.base,
    borderRadius: 20,
    marginBottom: SIZES.padding,
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.base,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    ...FONTS.h3,
    fontSize: 16,
  },
  customerAddress: {
    ...FONTS.body4,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  steps: {
    marginBottom: SIZES.padding,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    zIndex: 1,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  stepLine: {
    position: 'absolute',
    left: 11.5,
    top: 24,
    width: 1,
    height: 35,
    backgroundColor: COLORS.secondary,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 15,
  },
  stepTitle: {
    ...FONTS.h4,
    fontSize: 14,
  },
  stepTime: {
    ...FONTS.body4,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  completeButton: {
    height: 64,
    backgroundColor: '#FDEDEC',
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(211, 84, 0, 0.1)',
  },
  sliderThumb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  completeText: {
    ...FONTS.h4,
    color: 'rgba(211, 84, 0, 0.3)',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 2,
  },
  sparkle: {
    marginRight: 10,
  },
});

export default DeliveryDetailScreen;
