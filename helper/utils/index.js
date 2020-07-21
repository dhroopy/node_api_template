const query = require('../../loaders/database/connection');

//export function

module.exports = {
  changeSha1PassToBcrypt: async (user, hashedPassword) => {
    const sql = 'UPDATE user_master SET password = ? WHERE user_id = ?';
    const values = [hashedPassword, user.user_id];
    const results = await query(sql, values); // use t
    return results;
  },
};
