import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem(
    "interviewiq_token"
  );

  const fetchCurrentUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        localStorage.removeItem(
          "interviewiq_token"
        );

        setUser(null);
        return;
      }

      const data = await response.json();

      setUser(data.user);
    } catch (error) {
      console.error(
        "Authentication error:",
        error
      );

      localStorage.removeItem(
        "interviewiq_token"
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const response = await fetch(
      `${API_URL}/api/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Login failed."
      );
    }

    localStorage.setItem(
      "interviewiq_token",
      data.access_token
    );

    setUser(data.user);

    return data;
  };

  const signup = async (
    name,
    email,
    password
  ) => {
    const response = await fetch(
      `${API_URL}/api/auth/signup`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Signup failed."
      );
    }

    localStorage.setItem(
      "interviewiq_token",
      data.access_token
    );

    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem(
      "interviewiq_token"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};