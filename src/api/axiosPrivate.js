import makeRequest from "../axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";

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
      accessToken = JSON.parse(storedToken).access_token;
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
