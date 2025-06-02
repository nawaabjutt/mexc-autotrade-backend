const admin = require("firebase-admin");
const fs = require("fs");
const { monitorActiveTrades } = require("./tradeMonitor");

// ✅ Step 1: Decode FIREBASE_SERVICE_ACCOUNT from ENV
const serviceAccountJson = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf-8");
const serviceAccount = JSON.parse(serviceAccountJson);

// ✅ Step 2: Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://event-trading-app-default-rtdb.firebaseio.com",
});

const db = admin.database();

// ✅ Step 3: Start Auto Monitor
console.log("🚀 Auto-trade monitor started...");
setInterval(async () => {
  console.log("🔄 Checking active trades...");
  await monitorActiveTrades();
}, 10000);
