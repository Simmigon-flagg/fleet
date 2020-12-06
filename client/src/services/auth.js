export default {
  login: (user) => {
    return fetch("/api/v1/user/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status !== 401) return response.json().then((data) => data);
      return response.json().then((data) => data);
    });
  },

  logout: () => {
    const logoutUser = {};

    return fetch("/api/v1/user/logout", {
      method: "DELETE",
      body: { refreshToken: localStorage.getItem("refreshToken") },
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
