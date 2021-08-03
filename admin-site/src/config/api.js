import axios from "axios";
const axiosClient = axios.create({
  headers: {
    "content-type": "application/json",
  },
});
axiosClient.interceptors.request.use(async (config) => {
  const customHeaders = {};

  const accesstoken = localStorage.getItem("accesstoken");
  const refreshtoken = localStorage.getItem("refreshtoken");
  const expire_at = parseInt(localStorage.getItem("expire_at"));
  if (accesstoken && expire_at > Date.now()) {
    customHeaders.accesstoken = "bear " + accesstoken;
  } else if (refreshtoken) {
    console.log(refreshtoken, "refreshtoken");
    customHeaders.refreshtoken = "bear " + refreshtoken;
  }

  return {
    ...config,
    headers: {
      ...customHeaders, // auto attach token
      ...config.headers, // but you can override for some requests
    },
  };
});
axiosClient.interceptors.response.use(
  async (response) => {
    if (response && response.data) {
      const { token, user, data, err, message, clientId } = response.data;
      if (token) {
        localStorage.setItem("accesstoken", token.accesstoken);
        localStorage.setItem("refreshtoken", token.refreshtoken);
        localStorage.setItem("expire_at", Date.now() + 600 * 1000 -30);
      }
      return { user, data, err, message, clientId, };
    }
  },
  (err) => {
    return {err, status: 401}//Handle er
  }
);

export default axiosClient;
