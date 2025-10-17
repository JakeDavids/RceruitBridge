import { useState, useEffect } from "react";
import { User } from "@/api/entities";

export default function useRecruitBridgeIdentity() {
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadIdentity = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await User.me();
      
      if (!user?.id) {
        setIdentity(null);
        return;
      }

      // Call the identity/me endpoint
      const response = await fetch("/functions/identity/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`Failed to load identity: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.ok && data.identity) {
        setIdentity(data.identity);
      } else {
        setIdentity(null);
      }
    } catch (err) {
      console.error("Error loading identity:", err);
      setError(err.message);
      setIdentity(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdentity();
  }, []);

  return {
    identity,
    loading,
    error,
    reload: loadIdentity
  };
}