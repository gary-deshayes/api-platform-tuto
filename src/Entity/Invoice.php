<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 * @ApiResource(
 *   subresourceOperations = {
 *     "api_customers_invoices_get_subresource" = { "normalization_context" = { "groups" = "invoices_subresource"}}
 *   },
 *   itemOperations = {
 *     "GET", "PUT", "DELETE", 
 *     "increment" = { 
 *          "method" = "post", 
 *          "path" = "/invoices/{id}/increment", 
 *          "controller" = "App\Controller\InvoiceIncrementationController",
 *          "swagger_context" = {
 *              "summary" = "Incrémente une facture",
 *              "description" = "Incrémente le chrono d'une facture donnée"
 *          }
 *      }
 *   },
 *   attributes={
 *     "pagination_enabled" = false,
 *     "pagination_items_per_page" = 20,
 *     "order" : {
 *          "sentAt" : "DESC"
 *      }
 *   },
 *   normalizationContext = {
 *      "groups" = {"invoices_read"}
 *   },
 *   denormalizationContext = {
 *      "disable_type_enforcement" = true
 *   }
 * )
 * @ApiFilter(
 *      OrderFilter::class, properties={"amount","sentAt"}
 * )
 */
class Invoice
{
    /**
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @ORM\Column(type="float")
     * @Assert\NotBlank(message = "Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric", message = "Le montant de la facture doit être un numérique")
     */
    private $amount;

    /**
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @ORM\Column(type="datetime")
     * @Assert\NotBlank(message = "La date d'envoi doit être renseigné")
     */
    private $sentAt;

    /**
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message = "Le statut de la facture est obligatoire")
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"}, message = "Le statut doit être SENT, PAID ou CANCELLED")
     */
    private $status;

    /**
     * @Groups({"invoices_read"})
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotBlank(message = "Le client de la facture doit être renseigné")
     */
    private $customer;

    /**
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @ORM\Column(type="integer")
     * @Assert\NotBlank(message = "La date d'envoi doit être renseigné")
     * @Assert\Type(type="integer" ,message = "Le chrono doit être un nombre")
     */
    private $chrono;

    /**
     * @Groups({"invoices_read", "invoices_subresource"})
     *
     * @return User
     */
    public function getUser() :User
    {
        return $this->getCustomer()->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
