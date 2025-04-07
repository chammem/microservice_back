package tn.esprit.employesmicro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class EmployesMicroApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployesMicroApplication.class, args);
    }

}
