export const QUERY_KEYS = {
      // AUTH KEYS
  CREATE_USER_ACCOUNT: "createUserAccount",

  // USER KEYS
  GET_CURRENT_USER: "getCurrentUser",
  GET_USERS: "getUsers",
  GET_USER_BY_ID: "getUserById",

  // POST KEYS
  GET_POSTS: "getPosts",
  GET_INFINITE_POSTS: "getInfinitePosts",
  GET_RECENT_POSTS: "getRecentPosts",
  GET_POST_BY_ID: "getPostById",
  GET_USER_POSTS: "getUserPosts",
  GET_FILE_PREVIEW: "getFilePreview",

  GET_SAVED_POSTS: "getSavedPosts",
  GET_LIKED_POSTS: "getLikedPosts",
  //  SEARCH KEYS
  SEARCH_POSTS: "getSearchPosts",
  SEARCH_USERS: "searchUsers",
  SEARCH_SAVED_POSTS: "searchSavedPosts",

  GET_FOLLOWERS: "getFollowers",
  GET_FOLLOWING: "getFollowing",
} as const;

export type QUERY_KEYS = typeof QUERY_KEYS[keyof typeof QUERY_KEYS];