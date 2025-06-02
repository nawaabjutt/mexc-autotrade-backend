const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL
  });
}

const db = admin.database();

async function handleSignal(signal) {
  const usersRef = db.ref('users');
  const snapshot = await usersRef.once('value');
  const users = snapshot.val();

  if (!users) return;

  for (const uid in users) {
    const user = users[uid];
    if (!user.apiKey || !user.autoTradeEnabled) continue;

    const tradePath = `trades/${uid}/${signal.coin}_${Date.now()}`;
    await db.ref(tradePath).set({
      coin: signal.coin,
      type: signal.type,
      leverage: signal.leverage || 10,
      amountPercent: signal.amountPercent || 5,
      timestamp: Date.now(),
      status: 'open'
    });
  }
}

module.exports = { handleSignal };