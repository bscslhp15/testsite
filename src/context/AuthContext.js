import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const STORAGE_KEY = 'testsite-user';
  const PERSISTED_USER_KEY = 'testsite-user-persist';

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const mergeStoredUser = (incomingUser) => {
    if (!incomingUser) return incomingUser;

    try {
      const saved = localStorage.getItem(PERSISTED_USER_KEY);
      if (!saved) return incomingUser;

      const previousUser = JSON.parse(saved);
      if (!previousUser) return incomingUser;

      const sameUser =
        (incomingUser.email && previousUser.email && incomingUser.email === previousUser.email) ||
        (incomingUser.username && previousUser.username && incomingUser.username === previousUser.username);

      if (!sameUser) return incomingUser;

      return {
        ...incomingUser,
        ...previousUser,
        social: {
          ...(incomingUser.social || {}),
          ...(previousUser.social || {})
        },
        posts: previousUser.posts || incomingUser.posts || []
      };
    } catch (error) {
      console.error('Unable to merge saved user data.', error);
      return incomingUser;
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(PERSISTED_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (data) => setUser(mergeStoredUser(data));
  const logout = () => setUser(null);
  const updateProfile = (updates) => setUser((prev) => (prev ? { ...prev, ...updates } : prev));

  const deletePost = (postId) => {
    const globalPosts = JSON.parse(localStorage.getItem('testsite-posts') || '[]');
    const filteredGlobalPosts = globalPosts.filter((post) => String(post.id) !== String(postId));
    localStorage.setItem('testsite-posts', JSON.stringify(filteredGlobalPosts));

    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        posts: (prev.posts || []).filter((post) => String(post.id) !== String(postId))
      };
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, deletePost }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
