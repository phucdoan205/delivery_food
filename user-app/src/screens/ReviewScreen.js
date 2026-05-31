import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  TouchableOpacity, Image, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Star, ThumbsUp, ThumbsDown } from 'lucide-react-native';
import { request, API_URL } from '../api/client';
import io from 'socket.io-client/dist/socket.io.js';

const ReviewScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { order } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [foodReviews, setFoodReviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [merchantReply, setMerchantReply] = useState(null);

  useEffect(() => {
    checkReviewStatus();

    const socket = io(API_URL);
    socket.on('new_reply_for_user', (data) => {
      if (data.orderId === order._id) {
        checkReviewStatus(); // Refresh review data to get the reply
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const checkReviewStatus = async () => {
    try {
      const data = await request(`/reviews/check/${order._id}`);
      if (data.isReviewed) {
        setIsReviewed(true);
        setRating(data.review.rating);
        setComment(data.review.comment || '');
        const fr = {};
        if (data.review.foodReviews) {
          data.review.foodReviews.forEach(r => {
            fr[r.foodId] = r.isLiked;
          });
        }
        setFoodReviews(fr);
        if (data.review.reply) {
          setMerchantReply(data.review.reply);
        }
      }
    } catch (error) {
      console.log('Lỗi kiểm tra trạng thái review:', error);
    }
  };

  const handleFoodReview = (foodId, isLiked) => {
    if (isReviewed) return;
    setFoodReviews(prev => ({
      ...prev,
      [foodId]: isLiked
    }));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn mức đánh giá (số sao) cho nhà hàng');
      return;
    }

    setLoading(true);
    try {
      const formattedFoodReviews = Object.keys(foodReviews).map(key => ({
        foodId: key,
        isLiked: foodReviews[key]
      }));

      await request('/reviews', {
        method: 'POST',
        body: {
          orderId: order._id,
          restaurantId: order.restaurantId._id || order.restaurantId,
          rating,
          comment,
          foodReviews: formattedFoodReviews
        }
      });

      Alert.alert('Thành công', 'Cảm ơn bạn đã gửi đánh giá!', [
        { text: 'Đóng', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể gửi đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity 
          key={i} 
          onPress={() => !isReviewed && setRating(i)}
          style={{ marginHorizontal: 5 }}
          disabled={isReviewed}
        >
          <Star 
            size={40} 
            color={i <= rating ? '#FFC107' : COLORS.lightGray} 
            fill={i <= rating ? '#FFC107' : 'transparent'} 
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <View style={styles.restaurantCard}>
          <Image 
            source={{ uri: order.restaurantId?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop' }} 
            style={styles.restaurantImage} 
          />
          <Text style={styles.restaurantName}>{order.restaurantId?.name || 'Nhà hàng'}</Text>
          <Text style={styles.orderDate}>
            Đơn hàng ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chất lượng dịch vụ</Text>
          {renderStars()}
          <Text style={styles.ratingText}>
            {rating === 1 ? 'Tệ' : rating === 2 ? 'Không hài lòng' : rating === 3 ? 'Bình thường' : rating === 4 ? 'Hài lòng' : rating === 5 ? 'Tuyệt vời!' : 'Chọn sao để đánh giá'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đánh giá món ăn</Text>
          {order.items?.map((item, index) => {
            const food = item.foodId;
            if (!food) return null;
            const fId = food._id || food;
            const isLiked = foodReviews[fId] === true;
            const isDisliked = foodReviews[fId] === false;

            return (
              <View key={index} style={styles.foodItem}>
                <Image source={{ uri: food.image }} style={styles.foodImage} />
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name || 'Món ăn'}</Text>
                  <Text style={styles.foodDesc} numberOfLines={1}>SL: {item.quantity}</Text>
                </View>
                <View style={styles.likeControls}>
                  <TouchableOpacity 
                    style={[styles.likeBtn, isLiked && styles.likedBtn]} 
                    onPress={() => handleFoodReview(fId, true)}
                    disabled={isReviewed}
                  >
                    <ThumbsUp size={18} color={isLiked ? COLORS.white : COLORS.textLight} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.likeBtn, isDisliked && styles.dislikedBtn]} 
                    onPress={() => handleFoodReview(fId, false)}
                    disabled={isReviewed}
                  >
                    <ThumbsDown size={18} color={isDisliked ? COLORS.white : COLORS.textLight} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhận xét thêm</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Chia sẻ trải nghiệm của bạn về nhà hàng..."
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            editable={!isReviewed}
            textAlignVertical="top"
          />
        </View>
        
        {isReviewed && (
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Text style={{ color: COLORS.green, fontWeight: 'bold' }}>Bạn đã đánh giá đơn hàng này!</Text>
          </View>
        )}

        {isReviewed && merchantReply && (
          <View style={styles.replyBox}>
            <Text style={styles.replyLabel}>Phản hồi từ cửa hàng</Text>
            <Text style={styles.replyText}>{merchantReply}</Text>
          </View>
        )}

      </ScrollView>

      {!isReviewed && (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, SIZES.padding) }]}>
          <TouchableOpacity 
            style={[styles.submitBtn, rating === 0 && { backgroundColor: COLORS.lightGray }]}
            onPress={handleSubmit}
            disabled={loading || rating === 0}
          >
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>Gửi Đánh Giá</Text>}
          </TouchableOpacity>
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base * 2,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    padding: SIZES.padding,
  },
  restaurantCard: {
    alignItems: 'center',
    marginBottom: 30,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  section: {
    marginBottom: 25,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radiusLarge,
    ...SHADOWS.light,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 15,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  foodInfo: {
    flex: 1,
    marginLeft: 15,
  },
  foodName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  foodDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  likeControls: {
    flexDirection: 'row',
    gap: 10,
  },
  likeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likedBtn: {
    backgroundColor: COLORS.green,
  },
  dislikedBtn: {
    backgroundColor: COLORS.red,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    height: 100,
    backgroundColor: '#FAFAFA',
    color: COLORS.text,
  },
  footer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  replyBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  replyLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
  },
  replyText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  }
});

export default ReviewScreen;
