package tn.esprit.employesmicro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableDiscoveryClient
@EnableScheduling
@SpringBootApplication
public class EmployesMicroApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployesMicroApplication.class, args);
    }

}
