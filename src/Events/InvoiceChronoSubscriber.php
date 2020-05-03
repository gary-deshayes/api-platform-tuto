<?php

namespace App\Events;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    /**
     * @var Security
     */
    private $security;

    /**
     * @var InvoiceRepository
     */
    private $invoiceRepository;

    public function __construct(Security $security, InvoiceRepository $invoiceRepository)
    {
        $this->security = $security;
        $this->invoiceRepository = $invoiceRepository;
    }

    public static function  getSubscribedEvents(){
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event){
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        
        if($invoice instanceof Invoice && $method === "POST"){
            $user = $this->security->getUser();
            $chrono = $this->invoiceRepository->findNextChrono($user);
            $invoice->setChrono($chrono + 1);
            $invoice->setSentAt(new \DateTime());
        }
    }
}