const fs = require('fs');
let content = fs.readFileSync('src/screens/details/PersonalInfoScreen.js', 'utf8');

content = content.replace(
  'import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from \'react-native\';',
  'import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator } from \'react-native\';'
);

const stateStr = 'const [profile, setProfile] = React.useState(null);';
const newStateStr = `const [profile, setProfile] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({ fullName: "", phone: "", address: "", avatar: "" });

  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      setFormData({ 
        fullName: profile?.fullName || "", 
        phone: profile?.phone || "", 
        address: profile?.address || "",
        avatar: profile?.avatar || ""
      });
      return;
    }
    try {
      setLoading(true);
      await request("/auth/profile", { method: "PUT", body: formData });
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      Alert.alert("Lỗi", "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = () => {
    if (!isEditing) return;
    const randomSeed = Math.random().toString(36).substring(7);
    setFormData(prev => ({ ...prev, avatar: \`https://api.dicebear.com/7.x/adventurer/svg?seed=\${randomSeed}\` }));
  };`;
content = content.replace(stateStr, newStateStr);

content = content.replace(
  'const InfoItem = ({ icon, label, value }) => (',
  'const InfoItem = ({ icon, label, value, isEditField, editValue, onChange }) => ('
);

content = content.replace(
  '<Text style={styles.infoValue}>{value}</Text>',
  `{isEditing && isEditField ? (
          <TextInput 
            style={{ borderBottomWidth: 1, borderColor: COLORS.border, padding: 0, marginTop: 2, color: COLORS.text, fontWeight: "500" }}
            value={editValue}
            onChangeText={onChange}
            placeholder={label}
          />
        ) : (
          <Text style={styles.infoValue}>{value}</Text>
        )}`
);

content = content.replace(
  '<Image source={{ uri: profile?.avatar || \'https://api.dicebear.com/7.x/adventurer/svg?seed=\' + (profile?.fullName || \'Driver\') }} style={styles.avatar} />',
  '<Image source={{ uri: isEditing ? (formData.avatar || profile?.avatar) : (profile?.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + (profile?.fullName || "Driver")) }} style={styles.avatar} />'
);

content = content.replace(
  '<TouchableOpacity style={styles.editAvatarButton}>',
  '{isEditing && (<TouchableOpacity style={styles.editAvatarButton} onPress={handleAvatarChange}>'
);
content = content.replace(
  '<Ionicons name="camera" size={20} color={COLORS.white} />\n              </TouchableOpacity>',
  '<Ionicons name="camera" size={20} color={COLORS.white} />\n              </TouchableOpacity>)}'
);

content = content.replace(
  '<Text style={styles.userName}>{profile?.fullName || \'Đang tải...\'}</Text>',
  `{isEditing ? (
             <TextInput 
               style={[styles.userName, { borderBottomWidth: 1, borderColor: COLORS.border, minWidth: 200, textAlign: "center" }]} 
               value={formData.fullName} 
               onChangeText={(text) => setFormData({...formData, fullName: text})} 
             />
           ) : (
             <Text style={styles.userName}>{profile?.fullName || "Đang tải..."}</Text>
           )}`
);

content = content.replace(
  '<TouchableOpacity style={styles.editButton}>',
  '<TouchableOpacity style={styles.editButton} onPress={handleSave}>'
);
content = content.replace(
  '<Ionicons name="pencil" size={14} color={COLORS.white} />\n                 <Text style={styles.editButtonText}>Chỉnh sửa</Text>',
  `{loading ? <ActivityIndicator size="small" color={COLORS.white} /> : (
                   <>
                     <Ionicons name={isEditing ? "checkmark" : "pencil"} size={14} color={COLORS.white} />
                     <Text style={styles.editButtonText}>{isEditing ? "Lưu" : "Chỉnh sửa"}</Text>
                   </>
                 )}`
);

content = content.replace(
  '<InfoItem icon="call-outline" label="Số điện thoại" value={profile?.phone || \'Chưa cập nhật\'} />',
  '<InfoItem icon="call-outline" label="Số điện thoại" value={profile?.phone || "Chưa cập nhật"} isEditField={true} editValue={formData.phone} onChange={(t) => setFormData({...formData, phone: t})} />'
);

content = content.replace(
  '<Text style={styles.addressText}>{profile?.address || \'Chưa cập nhật\'}</Text>',
  `{isEditing ? (
                <TextInput 
                  style={[styles.addressText, { borderBottomWidth: 1, borderColor: COLORS.border }]} 
                  value={formData.address} 
                  onChangeText={(t) => setFormData({...formData, address: t})} 
                  multiline 
                />
              ) : (
                <Text style={styles.addressText}>{profile?.address || "Chưa cập nhật"}</Text>
              )}`
);

fs.writeFileSync('src/screens/details/PersonalInfoScreen.js', content);
