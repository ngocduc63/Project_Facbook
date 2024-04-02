import makeRequest from "../axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";

const updateAccessToken = async (newAccessToken) => {
  const storedToken = localStorage.getItem("token") || null;
  if (
    storedToken !== "undefined" &&
    storedToken !== "null" &&
    storedToken.length > 0
  ) {
    const token = await JSON.parse(storedToken);
    token.access_token = newAccessToken;
    localStorage.setItem("token", JSON.stringify(token));
  }
};

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || null;
    let accessToken = "";
    if (
      storedToken !== "undefined" &&
      storedToken !== "null" &&
      storedToken.length > 0
    ) {
      const token = JSON.parse(storedToken);
      accessToken = token.access_token;
    }
    const requestIntercept = makeRequest.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = makeRequest.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          await updateAccessToken(newAccessToken);
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return makeRequest(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      makeRequest.interceptors.request.eject(requestIntercept);
      makeRequest.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return makeRequest;
};

export default useAxiosPrivate;
