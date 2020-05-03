import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import axios from "axios";
import UsersAPI from "../services/UsersAPI";
import { toast } from "react-toastify";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  //Gestion des changements des input dans le form
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  //Gestion de la soumission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiErrors = {};
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
        setErrors(apiErrors);
        toast.error("Des erreurs dans votre formulaire");
        return;
    }
    try {
      await UsersAPI.register(user);
      setErrors({});
      toast.success("Vous êtes désormais inscrit, vous pouvez vous connecter !");
      history.replace("/login");
    } catch ({ response }) {
      // flash erreur ici

      const { violations } = response.data;

      if (violations) {
        violations.map(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        //flash erreur
      }
      toast.error("Des erreurs dans votre formulaire");
    }
    console.log(user);
  };
  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre Prénom"
          error={errors.firstName}
          value={user.firstName}
          onChange={handleChange}
        />
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Votre nom de famille"
          error={errors.lastName}
          value={user.lastName}
          onChange={handleChange}
        />
        <Field
          name="email"
          label="Adresse email"
          placeholder="Votre adresse email"
          type="email"
          error={errors.email}
          value={user.email}
          onChange={handleChange}
        />
        <Field
          name="password"
          label="Mot de passe"
          placeholder="Votre mot de passe ultra sécurisé"
          type="password"
          error={errors.password}
          value={user.password}
          onChange={handleChange}
        />
        <Field
          name="passwordConfirm"
          label="Confirmation de mot de passe"
          placeholder="Confirmez votre mot de passe"
          type="password"
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handleChange}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
