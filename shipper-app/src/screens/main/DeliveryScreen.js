import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
import { currentOrder } from '../../constants/mockData';

const { width, height } = Dimensions.get('window');

const DeliveryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Map Placeholder */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f6dfc0f?q=80&w=1200&auto=format&fit=crop' }} 
        style={styles.map}
      />

      <Header 
        showBack={false}
        title="Đang giao hàng"
        style={styles.header}
        rightComponent={
          <View style={styles.incomeBadge}>
            <Text style={styles.incomeText}>$142.50</Text>
          </View>
        }
      />

      <View style={styles.bottomContainer}>
         <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
               <View style={styles.tag}>
                  <Ionicons name="star" size={14} color={COLORS.white} />
                  <Text style={styles.tagText}>ĐƠN HÀNG MỚI CAO CẤP</Text>
               </View>
               <View style={styles.timer}>
                  <Ionicons name="time-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.timerText}>0:45</Text>
               </View>
            </View>

            <View style={styles.restaurantRow}>
               <Image source={{ uri: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=200&auto=format&fit=crop' }} style={styles.resImage} />
               <View style={styles.resInfo}>
                  <Text style={styles.resName}>{currentOrder.restaurant.name}</Text>
                  <View style={styles.resStats}>
                     <Ionicons name="navigate-outline" size={14} color={COLORS.textSecondary} />
                     <Text style={styles.resStatsText}>1.2 km  /  3.5 km</Text>
                  </View>
               </View>
            </View>

            <View style={styles.incomeSection}>
               <Text style={styles.incomeLabel}>THU NHẬP DỰ KIẾN</Text>
               <View style={styles.incomeRow}>
                  <Text style={styles.incomeValue}>35.000đ</Text>
                  <View style={styles.bonusTag}>
                     <Text style={styles.bonusTagText}>+5.000đ Thưởng</Text>
                  </View>
               </View>
            </View>

            <View style={styles.actions}>
               <CustomButton 
                  title="Từ chối" 
                  type="outline" 
                  style={styles.rejectButton} 
                  textStyle={{ color: COLORS.error }}
                  icon={<Ionicons name="close" size={20} color={COLORS.error} style={{marginRight: 8}} />}
               />
               <CustomButton 
                  title="Chấp nhận" 
                  style={styles.acceptButton}
                  icon={<Ionicons name="checkmark" size={20} color={COLORS.white} style={{marginRight: 8}} />}
                  onPress={() => navigation.navigate('History')} // Just for demo
               />
            </View>
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
    width: '100%',
    height: '100%',
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    marginTop: 40,
    backgroundColor: 'rgba(253, 245, 242, 0.9)',
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius * 2,
  },
  incomeBadge: {
    backgroundColor: 'rgba(211, 84, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  incomeText: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: SIZES.padding,
    left: SIZES.padding,
    right: SIZES.padding,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  tag: {
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    ...FONTS.h4,
    fontSize: 10,
    color: COLORS.white,
    marginLeft: 4,
  },
  timer: {
    backgroundColor: 'rgba(211, 84, 0, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timerText: {
    ...FONTS.h4,
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 4,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  resImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
    marginRight: SIZES.base,
  },
  resInfo: {
    flex: 1,
  },
  resName: {
    ...FONTS.h2,
    fontSize: 22,
  },
  resStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  resStatsText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  incomeSection: {
    backgroundColor: 'rgba(211, 84, 0, 0.03)',
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  incomeLabel: {
    ...FONTS.body4,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  incomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomeValue: {
    ...FONTS.h1,
    fontSize: 32,
    color: COLORS.text,
  },
  bonusTag: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: SIZES.base,
  },
  bonusTagText: {
    ...FONTS.h4,
    fontSize: 12,
    color: COLORS.white,
  },
  actions: {
    flexDirection: 'row',
  },
  rejectButton: {
    flex: 1,
    marginRight: SIZES.base,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderWidth: 0,
  },
  acceptButton: {
    flex: 1.5,
  },
});

export default DeliveryScreen;
