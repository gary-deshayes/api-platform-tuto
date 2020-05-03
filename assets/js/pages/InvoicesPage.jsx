import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import invoicesAPI from '../services/InvoicesAPI';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../loaders/TableLoader";


const STATUS_CLASSES = {
  PAID: "success",
  SENT: "primary",
  CANCELLED: "danger",
};

const STATUS_LABELS = {
  PAID: "Payée",
  SENT: "Envoyée",
  CANCELLED: "Annulée",
};

const InvoicesPage = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  //Charger les invoices au chargement du composant
  useEffect(() => {
    fetchInvoices();
  }, []);

  //Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);

  //Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  //Gestion de la suppression
  const handleDelete = async id => {
    const originalInvoices = [...invoices];
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    try {
        await invoicesAPI.delete(id);
        toast.success("La facture a bien été supprimée");
    } catch (error) {
        console.log(error.response);
        setInvoices(originalInvoices); 
        toast.error('Une erreur est survenue');
    }
  }

  //Permet de récupérer les invoices
  const fetchInvoices = async () => {
    try {
      const data = await invoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors du chargement des factures");
    }
  };

  //Filtre les invoices
  const filteredInvoices = invoices.filter((i) =>
    i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
    i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
    i.amount.toString().startsWith(search.toLowerCase()) ||
    STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  );

  //Pagination des données
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  //Gestion du format de date
  const formatDate = (str) => moment(str).format("DD/MM/YYYY");

  return (
    <>
    <div className=" d-flex justify-content-between align-items-center">
      <h1>Liste des factures</h1>
      <Link to='/invoices/new' className="btn btn-primary">Créer une facture</Link>
    
    </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Rechercher ..."
          className="form-control"
          onChange={handleSearch}
          value={search}
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th></th>
          </tr>
        </thead>
        {!loading && <tbody>
          {paginatedInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.chrono}</td>
              <td>
                <a href="#">
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </a>
              </td>
              <td className="text-center">{formatDate(invoice.sentAt)}</td>
              <td className="text-center">
                <span
                  className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="text-center">
                {invoice.amount.toLocaleString()}€
              </td>
              <td>
                <Link to={"/invoices/" + invoice.id } className="btn btn-sm btn-primary">Editer</Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>}
      </table>
      {loading && <TableLoader/>}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChanged={handlePageChange}
        length={invoices.length}
      />
    </>
  );
};

export default InvoicesPage;
