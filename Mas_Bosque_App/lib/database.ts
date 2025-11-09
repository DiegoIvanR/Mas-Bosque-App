import * as SQLite from "expo-sqlite";

// --- ROUTE TYPES ---
// This is the main Route type used throughout your app.
// It matches the Supabase table and is what components will expect.
export interface Route {
  id: string;
  name: string;
  location: string;
  image_url: string;
  rating: number;
  difficulty: string;
  distance_km: number;
  time_minutes: number;
  // The coordinate data, parsed as an object
  route_data: { latitude: number; longitude: number }[];
}

// This is a helper type that defines how a route is stored in SQLite.
// Notice 'route_data' is a string.
interface SavedRouteInDB {
  id: string;
  name: string;
  location: string;
  image_url: string;
  rating: number;
  difficulty: string;
  distance_km: number;
  time_minutes: number;
  // Stored as JSON.stringify()
  route_data: string;
}

// --- DATABASE SETUP ---

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

    -- ADDED: Create the saved_routes table
    CREATE TABLE IF NOT EXISTS saved_routes (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      location TEXT,
      image_url TEXT,
      rating REAL,
      difficulty TEXT,
      distance_km REAL,
      time_minutes INTEGER,
      route_data TEXT NOT NULL -- This will store the stringified JSON
    );
  `);
};

// --- USER & CONTACT FUNCTIONS (Your existing code) ---

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

// --- ROUTE FUNCTIONS (New) ---

/**
 * Saves a full route (fetched from Supabase) into the local SQLite database.
 * This is for the "Download" button.
 */
export const saveRouteLocally = async (route: Route): Promise<void> => {
  await db.runAsync(
    `INSERT OR REPLACE INTO saved_routes 
      (id, name, location, image_url, rating, difficulty, distance_km, time_minutes, route_data) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      route.id,
      route.name,
      route.location,
      route.image_url,
      route.rating,
      route.difficulty,
      route.distance_km,
      route.time_minutes,
      JSON.stringify(route.route_data), // <-- Store the coordinates as a JSON string
    ]
  );
};

/**
 * Fetches all saved routes from the local SQLite database.
 * This is for the "Saved" tab.
 */
export const getLocalSavedRoutes = async (): Promise<Route[]> => {
  const results = await db.getAllAsync<SavedRouteInDB>(
    "SELECT * FROM saved_routes;"
  );

  // Parse the JSON string back into an object for each route
  const routes: Route[] = results.map((row) => ({
    ...row,
    route_data: JSON.parse(row.route_data),
  }));

  return routes;
};

/**
 * Fetches a single saved route by its ID.
 * This is for Step 5.5 (Offline Navigation).
 */
export const getLocalRouteById = async (id: string): Promise<Route | null> => {
  const row = await db.getFirstAsync<SavedRouteInDB>(
    "SELECT * FROM saved_routes WHERE id = ?;",
    id
  );

  if (row) {
    // Parse the JSON string back into an object
    return {
      ...row,
      route_data: JSON.parse(row.route_data),
    };
  } else {
    return null; // Not found
  }
};

// --- LOGOUT FUNCTION (Modified) ---

// This function clears all data from the tables for logout
export const clearLocalData = async () => {
  try {
    // Drop tables in order (child first, then parents)
    await db.runAsync("DROP TABLE IF EXISTS emergency_contacts");
    await db.runAsync("DROP TABLE IF EXISTS user_profile");

    // ADDED: Also drop the saved_routes table
    await db.runAsync("DROP TABLE IF EXISTS saved_routes");

    console.log("Local database cleared.");

    // Re-initialize the tables immediately after dropping
    await initDatabase();
    console.log("Local database re-initialized.");
  } catch (error: any) {
    console.error("Error clearing local database:", error.message);
  }
};
// Add these two new functions to your existing lib/database.ts file

/**
 * Checks if a route with a given ID is already saved in the local database.
 * Returns true if saved, false otherwise.
 */
export const checkIfRouteIsSaved = async (id: string): Promise<boolean> => {
  try {
    const result = await db.getFirstAsync<{ id: string }>(
      "SELECT id FROM saved_routes WHERE id = ?;",
      id
    );
    return result != null;
  } catch (error) {
    console.error("Error checking if route is saved:", error);
    return false;
  }
};

/**
 * Deletes a single saved route by its ID.
 */
export const deleteLocalRouteById = async (id: string): Promise<void> => {
  try {
    await db.runAsync("DELETE FROM saved_routes WHERE id = ?;", id);
  } catch (error) {
    console.error("Error deleting local route:", error);
    throw error;
  }
};
