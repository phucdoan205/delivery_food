import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import CustomButton from '../../components/CustomButton';
import { currentOrder } from '../../constants/mockData';

const PickupConfirmationScreen = ({ navigation }) => {
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleCheck = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(item => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Xác nhận lấy hàng" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.restaurantCard}>
           <View style={styles.resHeader}>
              <View>
                 <Text style={styles.label}>CỬA HÀNG</Text>
                 <Text style={styles.resName}>{currentOrder.restaurant.name}</Text>
                 <View style={styles.addressRow}>
                    <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.addressText}>{currentOrder.restaurant.address}</Text>
                 </View>
              </View>
              <View style={styles.resIconBox}>
                 <Ionicons name="restaurant" size={30} color={COLORS.primary} />
              </View>
           </View>

           <View style={styles.resActions}>
              <TouchableOpacity style={styles.resActionButton}>
                 <Ionicons name="call-outline" size={18} color={COLORS.primary} />
                 <Text style={styles.resActionText}>Gọi nhà hàng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.resActionButton, { marginLeft: SIZES.base }]}>
                 <Ionicons name="navigate-outline" size={18} color={COLORS.primary} />
                 <Text style={styles.resActionText}>Chỉ đường</Text>
              </TouchableOpacity>
           </View>
        </View>

        <View style={styles.orderInfo}>
           <View>
              <Text style={styles.label}>MÃ ĐƠN HÀNG</Text>
              <Text style={styles.orderId}>#{currentOrder.id}</Text>
           </View>
           <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{currentOrder.status}</Text>
           </View>
        </View>

        <Text style={styles.sectionTitle}>Danh sách món ăn ({currentOrder.items.length})</Text>

        {currentOrder.items.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemCard}
            onPress={() => toggleCheck(item.id)}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop' }} 
              style={styles.itemImage} 
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
              <Text style={styles.itemNote}>{item.note}</Text>
            </View>
            <View style={[styles.checkBox, checkedItems.includes(item.id) && styles.checkedBox]}>
              {checkedItems.includes(item.id) && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.noteCard}>
           <View style={styles.noteHeader}>
              <Ionicons name="chatbox-ellipses-outline" size={20} color={COLORS.secondary} />
              <Text style={styles.noteTitle}>Ghi chú từ khách hàng</Text>
           </View>
           <Text style={styles.noteText}>{currentOrder.note}</Text>
        </View>

        <View style={styles.contactActions}>
           <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="chatbubble-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.contactButtonText}>NHẮN TIN</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="call-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.contactButtonText}>GỌI KHÁCH</Text>
           </TouchableOpacity>
        </View>

        <CustomButton 
          title="Xác nhận lấy hàng" 
          onPress={() => navigation.navigate('DeliveryDetail')}
          style={styles.confirmButton}
          disabled={checkedItems.length !== currentOrder.items.length}
          icon={<Ionicons name="checkmark-circle-outline" size={24} color={COLORS.white} style={{marginRight: 8}} />}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  restaurantCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  resHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 10,
    letterSpacing: 1,
  },
  resName: {
    ...FONTS.h2,
    fontSize: 22,
    marginVertical: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 4,
    width: '80%',
  },
  resIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(211, 84, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resActions: {
    flexDirection: 'row',
    marginTop: SIZES.padding,
  },
  resActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(211, 84, 0, 0.05)',
    paddingVertical: 12,
    borderRadius: 15,
  },
  resActionText: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontSize: 12,
    marginLeft: 6,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 84, 0, 0.03)',
    padding: SIZES.padding / 1.5,
    borderRadius: 20,
    marginBottom: SIZES.padding,
  },
  orderId: {
    ...FONTS.h2,
    fontSize: 20,
  },
  statusBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontSize: 11,
  },
  sectionTitle: {
    ...FONTS.h3,
    marginBottom: SIZES.base,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.base * 1.5,
    borderRadius: 20,
    marginBottom: SIZES.base,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: SIZES.base,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...FONTS.h4,
    fontSize: 15,
  },
  itemNote: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  noteCard: {
    backgroundColor: '#FEF9E7',
    padding: SIZES.padding / 1.5,
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    marginBottom: SIZES.padding,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    ...FONTS.h4,
    color: COLORS.secondary,
    marginLeft: 8,
  },
  noteText: {
    ...FONTS.body4,
    color: COLORS.text,
    fontSize: 13,
  },
  contactActions: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
  },
  contactButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.base,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  contactButtonText: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },
  confirmButton: {
    marginBottom: SIZES.padding * 2,
  },
});

export default PickupConfirmationScreen;
