import React, { useState, useContext } from "react";
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";
import Field from '../components/forms/Field';
import { toast } from "react-toastify";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");

  // Gestion des champs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCredentials({ ...credentials, [name]: value });
  };

  // Gestion du submit
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      toast.success("Vous êtes désormais connecté :)");
      history.replace("/customers");
    } catch (error) {
      setError(
        "Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas !"
      );
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <>
      <h1>Connexion à l'application</h1>

      <form onSubmit={handleSubmit}>
        <Field name="username" placeholder="Email" type="email" onChange={handleChange} value={credentials.username} error={error}/>
        <Field name="password" placeholder="Mot de passe" type="password" onChange={handleChange} value={credentials.password} error=""/>
        
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </>
  );
};
export default LoginPage;