<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    private $userPassword;

    public function __construct(UserPasswordEncoderInterface $userPassword)
    {
        $this->userPassword = $userPassword;
    }
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        

        for($u=0; $u < 10; $u++){
            $chrono = 1;
            $user = new User();
            $user->setFirstName($faker->firstName)
                 ->setLastName($faker->lastName)
                 ->setEmail($faker->email)
                 ->setPassword($this->userPassword->encodePassword($user, 'password'));
            $manager->persist($user);

            for ($c = 0; $c < mt_rand(5, 20); $c++) {
                $customer = new Customer();
                $customer->setFirstName($faker->firstname)
                    ->setLastName($faker->lastname)
                    ->setCompany($faker->company)
                    ->setEmail($faker->email)
                    ->setUser($user);
    
                $manager->persist($customer);
                for ($i = 0; $i < mt_rand(3, 10); $i++) {
                    $invoice = new Invoice();
                    $invoice->setCustomer($customer)
                        ->setAmount($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(["SENT", "PAID", "CANCELLED"]))
                        ->setChrono($chrono);
                    $chrono++;
                    $manager->persist($invoice);
                }
            }
        }

        
        $manager->flush();
    }
}
