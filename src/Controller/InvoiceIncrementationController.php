<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;

class InvoiceIncrementationController {

    /**
     * @var ObjectManager
     */
    private $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    public function __invoke(Invoice $data)
    {
        $data->setChrono($data->getChrono() + 1);
        $this->manager->flush();
        return $data;
    }
}