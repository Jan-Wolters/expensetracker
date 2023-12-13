import { Input } from "./input";
import { login } from "../api";
import { useState } from "react";
import { Auth } from "../contexts/Auth";
import { useNavigate } from "react-router-dom";
import "./style/frominput.scss"
export const Login = () => {
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn } = Auth.use();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    const success = await login(username, password);

    if (success) {
      setError(null);
      setIsLoggedIn(true);
      navigate("/Home");
    } else {
      setError("Invalid username or password!");
    }

    setIsLoading(false);
  };

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  return isLoggedIn ? null : (
    <form id="inform" onSubmit={handleSubmit}>
      <Input
        type="text"
        name="username"
        value={username}
        onChange={onUsernameChange}
      />
      <Input
        type="password"
        name="password"
        value={password}
        onChange={onPasswordChange}
      />
      <div style={{ color: "red" }}>{error}</div>
      <button type="submit">Login</button>
    </form>
  );
};
