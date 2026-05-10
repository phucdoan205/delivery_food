import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Switch } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Bell, Search as Package, Search as MessageSquare, Search as Ticket, Settings } from 'lucide-react-native';
import { NOTIFICATIONS } from '../constants/mockData';

const NotificationSettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState(NOTIFICATIONS);

  const toggleSwitch = (id) => {
    setSettings(prev => prev.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'package': return <Package size={20} color={COLORS.green} />;
      case 'message-square': return <MessageSquare size={20} color="#FF7043" />;
      case 'ticket': return <Ticket size={20} color="#FBC02D" />;
      case 'settings': return <Settings size={20} color={COLORS.textLight} />;
      default: return <Bell size={20} color={COLORS.primary} />;
    }
  };

  const renderItem = ({ item, index }) => {
    // Group headers
    const showHeader = index === 0 || index === 2;
    const headerTitle = index === 0 ? "ĐƠN HÀNG & GIAO VẬN" : "ƯU ĐÃI & TIN TỨC";

    return (
      <View>
        {showHeader && <Text style={styles.sectionHeader}>{headerTitle}</Text>}
        <View style={styles.settingCard}>
          <View style={[styles.iconContainer, { backgroundColor: item.enabled ? '#F5F5F5' : '#F5F5F5' }]}>
            {getIcon(item.icon)}
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingDesc}>{item.description}</Text>
          </View>
          <Switch
            trackColor={{ false: '#E0E0E0', true: COLORS.primary }}
            thumbColor={COLORS.white}
            ios_backgroundColor="#E0E0E0"
            onValueChange={() => toggleSwitch(item.id)}
            value={item.enabled}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt thông báo</Text>
        <TouchableOpacity>
          <Settings size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.promoCard}>
          <View style={styles.promoIconContainer}>
            <Bell size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.promoTitle}>Tùy chỉnh trải nghiệm</Text>
          <Text style={styles.promoSubtitle}>
            Chọn những cập nhật quan trọng nhất để chúng tôi luôn giữ bạn trong vòng kết nối.
          </Text>
        </View>

        <FlatList
          data={settings}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={() => (
            <View style={styles.footerContainer}>
              <Text style={styles.footerInfo}>Bạn muốn tạm thời không làm phiền?</Text>
              <TouchableOpacity style={styles.quietModeBtn}>
                <Text style={styles.quietModeBtnText}>Chế độ im lặng</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  promoCard: {
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    ...SHADOWS.light,
  },
  promoIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF1E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  promoSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 15,
    marginTop: 10,
    letterSpacing: 1,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    ...SHADOWS.light,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  settingDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 3,
  },
  listContent: {
    paddingBottom: 30,
  },
  footerContainer: {
    marginTop: 10,
    padding: 25,
    backgroundColor: '#FFF1E8',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0B0A0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  footerInfo: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  quietModeBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 12,
  },
  quietModeBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default NotificationSettingsScreen;
