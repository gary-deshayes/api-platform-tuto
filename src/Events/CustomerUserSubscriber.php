<?php

namespace App\Events;

use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class CustomerUserSubscriber implements EventSubscriberInterface
{
    /**
     * @var Security
     */
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }
    public static function  getSubscribedEvents(){
        return [
            KernelEvents::VIEW => ['setUserFormCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserFormCustomer(ViewEvent $event){
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        
        if($customer instanceof Customer && $method === "POST"){
            $user = $this->security->getUser();
            $customer->setUser($user);
        }
    }
}