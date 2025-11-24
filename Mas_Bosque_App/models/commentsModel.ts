import { supabase } from "@/lib/SupabaseClient";

export interface Comment {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  text: string;
  createdAt: Date;
  parentId: string | null;
  level: number;
}

// Helper to calculate "Time Ago"
export const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return Math.floor(seconds) + "s";
};

export const getComments = async (route_id: string): Promise<Comment[]> => {
  // We join user_profiles to get names.
  // NOTE: This assumes 'user_id' in comments is a Foreign Key to 'user_profiles.id'
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id, 
      comment, 
      user_id, 
      route_id, 
      created_at, 
      parent_id,
      user_profile (
        first_name,
        last_name
      )
    `
    )
    .eq("route_id", route_id)
    .order("created_at", { ascending: true });
  console.log(data);
  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  // 1. Create a Map for easy lookup
  const commentMap = new Map<string, any>();

  data.forEach((item: any) => {
    // Handle the joined data safely
    const profile = item.user_profile || {}; // array or object depending on relationship (usually object for 1:1)
    // Supabase returns an object for single relation or array for multiple.
    // Assuming user_id -> id is one-to-one or many-to-one
    const firstName = Array.isArray(profile)
      ? profile[0]?.first_name
      : profile?.first_name;
    const lastName = Array.isArray(profile)
      ? profile[0]?.last_name
      : profile?.last_name;

    commentMap.set(item.id, {
      ...item,
      firstName: firstName || "Unknown",
      lastName: lastName || "User",
      children: [],
    });
  });

  // 2. Build the Tree
  const rootComments: any[] = [];
  commentMap.forEach((item) => {
    if (item.parent_id) {
      const parent = commentMap.get(item.parent_id);
      if (parent) {
        parent.children.push(item);
      } else {
        // Orphaned comment (parent deleted?), treat as root or hide
        rootComments.push(item);
      }
    } else {
      rootComments.push(item);
    }
  });

  // 3. Flatten the Tree
  const flattened: Comment[] = [];
  const traverse = (nodes: any[], level: number) => {
    nodes.forEach((node) => {
      flattened.push({
        id: node.id,
        userId: node.user_id,
        firstName: node.firstName,
        lastName: node.lastName,
        text: node.comment,
        createdAt: new Date(node.created_at),
        parentId: node.parent_id,
        level: level,
      });
      if (node.children.length > 0) {
        traverse(node.children, level + 1);
      }
    });
  };

  traverse(rootComments, 0);
  return flattened;
};

export const addComment = async (
  route_id: string,
  text: string,
  parent_id: string | null = null
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        route_id,
        user_id: user?.id,
        comment: text,
        parent_id,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};
