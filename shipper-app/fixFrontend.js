const fs = require('fs');

let content = fs.readFileSync('src/screens/details/PersonalInfoScreen.js', 'utf8');

// Update formData initialization
content = content.replace(
  'const [formData, setFormData] = useState({ fullName: \'\', phone: \'\', address: \'\', avatar: \'\' });',
  'const [formData, setFormData] = useState({ fullName: \'\', phone: \'\', address: \'\', avatar: \'\', cccd: \'\', dob: \'\' });'
);

// Update openEditModal
content = content.replace(
  'avatar: profile?.avatar || \'\'\n    });',
  'avatar: profile?.avatar || \'\',\n      cccd: profile?.cccd || \'\',\n      dob: profile?.dob || \'\'\n    });'
);

// Update InfoItems
content = content.replace(
  '<InfoItem icon="card-outline" label="Số CCCD" value={\'Chưa cập nhật\'} />',
  '<InfoItem icon="card-outline" label="Số CCCD" value={profile?.cccd || \'Chưa cập nhật\'} />'
);
content = content.replace(
  '<InfoItem icon="calendar-outline" label="Ngày sinh" value={\'Chưa cập nhật\'} />',
  '<InfoItem icon="calendar-outline" label="Ngày sinh" value={profile?.dob || \'Chưa cập nhật\'} />'
);

// Add TextInputs to Modal
const dobInputString = `              <Text style={styles.inputLabel}>Số CCCD</Text>
              <TextInput
                style={styles.inputField}
                value={formData.cccd}
                onChangeText={(t) => setFormData({...formData, cccd: t})}
                placeholder="Nhập số CCCD"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Ngày sinh</Text>
              <TextInput
                style={styles.inputField}
                value={formData.dob}
                onChangeText={(t) => setFormData({...formData, dob: t})}
                placeholder="VD: 15/05/1992"
              />

              <Text style={styles.inputLabel}>Địa chỉ</Text>`;
content = content.replace('              <Text style={styles.inputLabel}>Địa chỉ</Text>', dobInputString);

fs.writeFileSync('src/screens/details/PersonalInfoScreen.js', content);
