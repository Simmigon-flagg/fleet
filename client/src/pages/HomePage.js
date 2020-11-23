import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useForm } from "react-hook-form";
import auth from "../services/auth";

const HomePage = () => {
  const { register, handleSubmit, errors } = useForm();
  const { user, setUser } = useContext(UserContext);

  const onSubmit = async (data) => {
    const user = await auth.login({
      name: data.name,
      password: data.password
    });
  
    setUser(user);
  };
  return (
    <div className="container">
      <h1>Fleet System</h1>
      {user && user.name ? <h1>Welcome: {user.name}</h1> : null}
      {user && user.message ? <h6>{user.message}</h6> : null}

      {user && user.name ? (
null
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              name="name"
              ref={register({
                required: "Name Required",
              })}
            />
            <input
              type="password"
              name="password"
              ref={register({ required: "Password Required", minLength: 2 })}
            />
            <input type="submit" />
          </form>

        </>
      )}
    </div>
  );
};

export default HomePage;
