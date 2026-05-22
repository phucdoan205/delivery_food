const fs = require('fs');

// 1. Update User.js
let userModel = fs.readFileSync('src/models/User.js', 'utf8');
if (!userModel.includes('cccd: {')) {
  userModel = userModel.replace(
    'address: {\n    type: String\n  },',
    'address: {\n    type: String\n  },\n  cccd: {\n    type: String\n  },\n  dob: {\n    type: String\n  },'
  );
  fs.writeFileSync('src/models/User.js', userModel);
}

// 2. Update authController.js
let authCtrl = fs.readFileSync('src/controllers/authController.js', 'utf8');
if (!authCtrl.includes('user.cccd = req.body.cccd')) {
  authCtrl = authCtrl.replace(
    'user.address = req.body.address || user.address',
    'user.address = req.body.address || user.address\n    user.cccd = req.body.cccd || user.cccd\n    user.dob = req.body.dob || user.dob'
  );
  
  // Add io.emit to updateUserProfile
  const updateUserProfileSave = '    const updatedUser = await user.save()\n\n    res.json({';
  const newUpdateUserProfileSave = `    const updatedUser = await user.save()

    const io = req.app.get('io');
    if (io) {
      io.emit('new_user_registered');
    }

    res.json({`;
  authCtrl = authCtrl.replace(updateUserProfileSave, newUpdateUserProfileSave);

  // Add cccd and dob to res.json output
  authCtrl = authCtrl.replace(
    'address: updatedUser.address,\n      status: updatedUser.status',
    'address: updatedUser.address,\n      cccd: updatedUser.cccd,\n      dob: updatedUser.dob,\n      status: updatedUser.status'
  );
  fs.writeFileSync('src/controllers/authController.js', authCtrl);
}
