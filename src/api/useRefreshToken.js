import axios from "../axios";

const useRefreshToken = () => {
  const storedToken = localStorage.getItem("token") || null;
  let refreshToken = "";
  if (
    storedToken &&
    storedToken !== "undefined" &&
    storedToken !== "null" &&
    storedToken.length > 0
  ) {
    const token = JSON.parse(storedToken);
    
    refreshToken = token.refresh_token;
  }

  const refresh = async () => {
    const response = await axios.post(
      "/user-management/user/refresh",
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    return response.data.data.access_token;
  };
  return refresh;
};

export default useRefreshToken;
