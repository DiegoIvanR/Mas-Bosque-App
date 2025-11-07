import * as SQLite from "expo-sqlite";

// This opens or creates the database.
const db = SQLite.openDatabaseSync("app.db");

// This function creates your tables if they don't exist.
export const initDatabase = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY NOT NULL,
      first_name TEXT,
      last_name TEXT,
      blood_type TEXT,
      allergies TEXT,
      medical_conditions TEXT,
      medications TEXT
    );

    CREATE TABLE IF NOT EXISTS emergency_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT,
      last_name TEXT,
      phone TEXT,
      relationship TEXT,
      FOREIGN KEY (user_id) REFERENCES user_profile (id)
    );
  `);
};

// This function saves all the user data in one go.
// 'INSERT OR REPLACE' is perfect here: it inserts if new, or updates if the ID already exists.
export const saveUserDataLocally = async (profile: any, contact: any) => {
  await db.runAsync(
    `INSERT OR REPLACE INTO user_profile (id, first_name, last_name, blood_type, allergies, medical_conditions, medications) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    profile.id,
    profile.first_name,
    profile.last_name,
    profile.blood_type,
    profile.allergies,
    profile.medical_conditions,
    profile.medications
  );

  await db.runAsync(
    `INSERT OR REPLACE INTO emergency_contacts (id, user_id, name, last_name, phone, relationship)
     VALUES (?, ?, ?, ?, ?, ?)`,
    contact.id, // Assumes 'id' is returned from Supabase
    contact.user_id,
    contact.name,
    contact.last_name,
    contact.phone,
    contact.relationship
  );
};

// You'll use this function later in your app to get data when offline
export const getLocalUserData = async (userId: string) => {
  const profile = await db.getFirstAsync(
    "SELECT * FROM user_profile WHERE id = ?",
    userId
  );
  const contact = await db.getFirstAsync(
    "SELECT * FROM emergency_contacts WHERE user_id = ?",
    userId
  );
  return { profile, contact };
};

// --- NEW FUNCTION ADDED ---
// This function clears all data from the tables for logout
export const clearLocalData = async () => {
  await db.runAsync("DELETE FROM emergency_contacts");
  await db.runAsync("DELETE FROM user_profile");
  console.log("Local database cleared.");
};
