import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import CustomersAPI from "../services/customersAPI";
import { toast } from "react-toastify";
import FormContentLoader from "../loaders/FormContentLoader";

const CustomerPage = ({ history, match }) => {
  const { id = "new" } = match.params;
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [editing, setEditing] = useState(false);

  //Récupération du customer en fonction de l'id
  const fetchCustomer = async (id) => {
    try {
      const { firstName, lastName, email, company } = await CustomersAPI.find(
        id
      );
      setCustomer({ firstName, lastName, email, company });
      setLoading(false);
    } catch (error) {
      toast.error("Le client n'a pas été chargé");
      history.replace("/customers");
    }
  };

  //Chargement du customer si besoin ou changement de l'id
  useEffect(() => {
    if (id != "new") {
      setLoading(true);
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  //Gestion des changements des input dans le form
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setErrors({});
      if (editing) {
        await CustomersAPI.update(id, customer);
        toast.success("Le client a bien été modifié");
      } else {
        await CustomersAPI.create(customer);
        toast.success("Le client a bien été crée");
        history.replace("/customers");
      }
      
    } catch ({ response }) {
      

      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.map(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
      toast.error("Des erreurs dans votre formulaire");
    }
  };
  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}
      {loading && <FormContentLoader/>}
      {!loading && <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Nom de famille du client"
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Prénom du client"
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email"
          placeholder="Adresse email du client"
          type="email"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          label="Entreprise"
          placeholder="Entreprise du client"
          value={customer.company}
          onChange={handleChange}
          error={errors.company}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>}
    </>
  );
};

export default CustomerPage;
