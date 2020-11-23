export default {
    login: (user) => {
      return fetch("/api/v1/user/login", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        
        if (response.status != 401) return response.json().then((data) => data);
        return response.json().then((data) => data);
      });
    },
    register: (user) => {
      return fetch("/user/register", {
        method: "post",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => data);
    },
    logout: () => {
      const logoutUser = {
        refreshToken: localStorage.getItem("refreshToken"),
      };
     
      return fetch("/api/v1/logout", {
        method: "DELETE",
        body: JSON.stringify(logoutUser),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  };
  