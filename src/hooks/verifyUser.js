import { useState, useEffect } from "react";
import axios from "axios";

const useVerifyUser = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [verifyingUser, setVerifyingUser] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("/api/verify", {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.user) {
          setIsVerified(response.data.user);
        } else {
          setIsVerified(false);
        }
      } catch (err) {
        setError(err);
      } finally {
        setVerifyingUser(false);
      }
    };

    verifyToken();
  }, []);

  return { isVerified, verifyingUser, error };
};

export default useVerifyUser;
