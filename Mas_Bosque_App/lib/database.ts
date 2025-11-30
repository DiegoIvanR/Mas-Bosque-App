import * as SQLite from "expo-sqlite";
import { supabase } from "./SupabaseClient";
// --- FIX: Point to legacy to restore readAsStringAsync ---
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";

// --- TYPES ---

export interface RecordedSession {
  id?: number;
  start_time: string;
  end_time: string | null;
  distance_km: number;
  duration_seconds: number;
  route_data: { latitude: number; longitude: number }[];
  interest_points: InterestPoint[];
  name?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  local_image_uri?: string;
}

export interface InterestPoint {
  id: string | number;
  latitude: number;
  longitude: number;
  type: "hazard" | "drop" | "viewpoint" | "general";
  note?: string;
  created_at: string;
}

export interface Route {
  id: string;
  name: string;
  location: string;
  image_url: string;
  rating: number;
  difficulty: string;
  distance_km: number;
  time_minutes: number;
  route_data: { latitude: number; longitude: number }[];
  interest_points: InterestPoint[];
}

interface SavedRouteInDB {
  id: string;
  name: string;
  location: string;
  image_url: string;
  rating: number;
  difficulty: string;
  distance_km: number;
  time_minutes: number;
  route_data: string;
  interest_points: string;
}

// --- DATABASE SETUP ---

const db = SQLite.openDatabaseSync("app.db");

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
      medications TEXT,
      role TEXT
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

    CREATE TABLE IF NOT EXISTS saved_routes (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      location TEXT,
      image_url TEXT,
      rating REAL,
      difficulty TEXT,
      distance_km REAL,
      time_minutes INTEGER,
      route_data TEXT NOT NULL,
      interest_points TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS recorded_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      distance_km REAL,
      duration_seconds INTEGER,
      route_data TEXT NOT NULL,
      synced_to_supabase INTEGER DEFAULT 0,
      name TEXT, 
      difficulty TEXT,
      local_image_uri TEXT
    );

    CREATE TABLE IF NOT EXISTS interest_points (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      session_id INTEGER NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      type TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES recorded_sessions (id)
    );
  `);
};

// --- USER & CONTACT FUNCTIONS ---
export const saveUserDataLocally = async (profile: any, contact: any) => {
  await db.runAsync(
    `INSERT OR REPLACE INTO user_profile (id, first_name, last_name, blood_type, allergies, medical_conditions, medications, role) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      profile.id,
      profile.first_name,
      profile.last_name,
      profile.blood_type,
      profile.allergies,
      profile.medical_conditions,
      profile.medications,
      profile.role,
    ]
  );

  await db.runAsync(
    `INSERT OR REPLACE INTO emergency_contacts (id, user_id, name, last_name, phone, relationship)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      contact.id,
      contact.user_id,
      contact.name,
      contact.last_name,
      contact.phone,
      contact.relationship,
    ]
  );
};

export const updateContactLocally = async (contact: any) => {
  await db.runAsync(
    `UPDATE emergency_contacts
     SET user_id = ?, name = ?, last_name = ?, phone = ?, relationship = ?
     WHERE id = ?`,
    [
      contact.user_id,
      contact.name,
      contact.last_name,
      contact.phone,
      contact.relationship,
      contact.id,
    ]
  );
};

export const updateMedicalLocally = async (profile: any) => {
  await db.runAsync(
    `UPDATE user_profile
     SET blood_type = ?, allergies = ?, medical_conditions = ?, medications = ?
     WHERE id = ?`,
    [
      profile.blood_type,
      profile.allergies,
      profile.medical_conditions,
      profile.medications,
      profile.id,
    ]
  );
};

export const updateNameLocally = async (profile: any) => {
  await db.runAsync(
    `UPDATE user_profile
     SET first_name = ?, last_name = ?
     WHERE id = ?`,
    [profile.first_name, profile.last_name, profile.id]
  );
};

export const getLocalUserData = async (userId: string) => {
  const profile = await db.getFirstAsync(
    "SELECT * FROM user_profile WHERE id = ?",
    [userId]
  );
  const contact = await db.getFirstAsync(
    "SELECT * FROM emergency_contacts WHERE user_id = ?",
    [userId]
  );
  return { profile, contact };
};

// --- SAVED ROUTE FUNCTIONS ---

export const saveRouteLocally = async (route: Route): Promise<void> => {
  await db.runAsync(
    `INSERT OR REPLACE INTO saved_routes 
      (id, name, location, image_url, rating, difficulty, distance_km, time_minutes, route_data, interest_points) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      route.id,
      route.name,
      route.location,
      route.image_url,
      route.rating,
      route.difficulty,
      route.distance_km,
      route.time_minutes,
      JSON.stringify(route.route_data),
      JSON.stringify(route.interest_points || []),
    ]
  );
};

export const getLocalSavedRoutes = async (): Promise<Route[]> => {
  const results = await db.getAllAsync<SavedRouteInDB>(
    "SELECT * FROM saved_routes;"
  );

  return results.map((row) => ({
    ...row,
    route_data: JSON.parse(row.route_data),
    interest_points: row.interest_points ? JSON.parse(row.interest_points) : [],
  }));
};

export const getLocalRouteById = async (id: string): Promise<Route | null> => {
  const row = await db.getFirstAsync<SavedRouteInDB>(
    "SELECT * FROM saved_routes WHERE id = ?;",
    [id]
  );

  if (row) {
    return {
      ...row,
      route_data: JSON.parse(row.route_data),
      interest_points: row.interest_points
        ? JSON.parse(row.interest_points)
        : [],
    };
  } else {
    return null;
  }
};

export const checkIfRouteIsSaved = async (id: string): Promise<boolean> => {
  try {
    const result = await db.getFirstAsync<{ id: string }>(
      "SELECT id FROM saved_routes WHERE id = ?;",
      [id]
    );
    return result != null;
  } catch (error) {
    console.error("Error checking if route is saved:", error);
    return false;
  }
};

export const deleteLocalRouteById = async (id: string): Promise<void> => {
  try {
    await db.runAsync("DELETE FROM saved_routes WHERE id = ?;", [id]);
  } catch (error) {
    console.error("Error deleting local route:", error);
    throw error;
  }
};

// --- RECORDING SESSION FUNCTIONS ---

export const saveRecordedSession = async (session: RecordedSession) => {
  try {
    // 1. Insert Session (SQLite generates ID)
    const result = await db.runAsync(
      `INSERT INTO recorded_sessions 
       (start_time, end_time, distance_km, duration_seconds, route_data, synced_to_supabase, name, difficulty, local_image_uri)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)`,
      [
        session.start_time,
        session.end_time || new Date().toISOString(),
        session.distance_km,
        session.duration_seconds,
        JSON.stringify(session.route_data),
        session.name || "Untitled Route",
        session.difficulty || "Medium",
        session.local_image_uri || null,
      ]
    );

    const localSessionId = result.lastInsertRowId;

    // 2. Insert Interest Points linked to that Local ID
    for (const point of session.interest_points) {
      await db.runAsync(
        `INSERT INTO interest_points (session_id, latitude, longitude, type, note, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          localSessionId,
          point.latitude,
          point.longitude,
          point.type,
          point.note || "",
          point.created_at,
        ]
      );
    }
    console.log("Session saved locally with ID:", localSessionId);
    return localSessionId;
  } catch (error: any) {
    console.error("Error saving session locally:", error.message);
    throw error;
  }
};

// --- UPLOADING LOGIC ---

export const uploadSessionToSupabase = async (localSessionId: number) => {
  try {
    // 1. Get the authenticated user ID first
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("User not authenticated");

    const session = await db.getFirstAsync<any>(
      "SELECT * FROM recorded_sessions WHERE id = ?",
      [localSessionId]
    );
    const points = await db.getAllAsync<any>(
      "SELECT * FROM interest_points WHERE session_id = ?",
      [localSessionId]
    );

    if (!session) throw new Error("Local session not found");

    let publicImageUrl = "";

    // 2. Handle Image Upload
    if (session.local_image_uri) {
      const fileName = `${session.start_time}_${localSessionId}.jpg`;

      // Use the LEGACY readAsStringAsync
      const base64 = await FileSystem.readAsStringAsync(
        session.local_image_uri,
        {
          encoding: "base64",
        }
      );

      const { error: uploadError } = await supabase.storage
        .from("route_images")
        .upload(fileName, decode(base64), {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("route_images")
        .getPublicUrl(fileName);

      publicImageUrl = urlData.publicUrl;
    }

    // 3. Prepare Route Payload with USER_ID
    const routePayload = {
      user_id: user.id, // <--- Ensures RLS compliance
      name: session.name,
      location: "Guadalajara, MX",
      image_url: publicImageUrl,
      rating: 0,
      difficulty: session.difficulty,
      distance_km: session.distance_km,
      time_minutes: Math.floor(session.duration_seconds / 60),
      route_data: JSON.parse(session.route_data),
    };

    // 4. Insert into Routes
    const { data: newRoute, error: routeError } = await supabase
      .from("routes")
      .insert([routePayload])
      .select("id")
      .single();

    if (routeError) throw routeError;
    const realSupabaseId = newRoute.id;

    // 5. Upload Points using the NEW UUID
    if (points.length > 0) {
      const pointsPayload = points.map((p) => ({
        route_id: realSupabaseId,
        latitude: p.latitude,
        longitude: p.longitude,
        type: p.type,
        note: p.note,
        created_at: p.created_at,
      }));

      const { error: pointsError } = await supabase
        .from("interest_points")
        .insert(pointsPayload);

      if (pointsError) throw pointsError;
    }

    // 6. Mark Local Session as Synced
    await db.runAsync(
      "UPDATE recorded_sessions SET synced_to_supabase = 1 WHERE id = ?",
      [localSessionId]
    );

    return true;
  } catch (error: any) {
    console.error("Upload failed:", error.message);
    throw error;
  }
};

export const getUnsyncedSessions = async () => {
  const sessions = await db.getAllAsync(
    "SELECT * FROM recorded_sessions WHERE synced_to_supabase = 0"
  );
  return sessions;
};

export const clearLocalData = async () => {
  try {
    await db.runAsync("DROP TABLE IF EXISTS interest_points");
    await db.runAsync("DROP TABLE IF EXISTS emergency_contacts");
    await db.runAsync("DROP TABLE IF EXISTS recorded_sessions");
    await db.runAsync("DROP TABLE IF EXISTS user_profile");
    await db.runAsync("DROP TABLE IF EXISTS saved_routes");

    console.log("Local database cleared.");
    await initDatabase();
    console.log("Local database re-initialized.");
  } catch (error: any) {
    console.error("Error clearing local database:", error.message);
  }
};
