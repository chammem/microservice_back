package tn.esprit.employesmicro.controller;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.employesmicro.entity.Employee;
import tn.esprit.employesmicro.entity.Shift;
import tn.esprit.employesmicro.service.IService;
import tn.esprit.employesmicro.service.MailService;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@AllArgsConstructor
@RestController
@RequestMapping("/employee")
public class EmployeeRestApi {
    IService service;
    private final MailService mailService;
    @GetMapping("/find-all")
    public List<Employee> getAllEmployees() {
        return service.getAllEmployees();
    }
    @GetMapping("/find/{id}")
    public Optional<Employee> getEmployeeById(@PathVariable Long id) {
        return service.getEmployeeById(id);
    }
    @PostMapping("/create-employee")
    public Employee createEmployee(@RequestBody Employee employee) {
        return service.addEmployee(employee);
    }
    @PostMapping("/create-shift")
    public Shift createShift(@RequestBody Shift shift) {
        return service.addShift(shift);
    }
    @PutMapping("/assigne-employee-shift/{shiftId}/{employeeId}")
    public Shift  assignEmployeeShift(@PathVariable Long shiftId, @PathVariable Long employeeId) {

        return service.assignEmployeeToSHift(shiftId, employeeId);
    }
    @GetMapping("/{employeeId}/shifts")
    public List<Shift> getShiftsOfEmployee(@PathVariable Long employeeId) {
        return service.getShiftsOfEmployee(employeeId);
    }
    @GetMapping("/shift/{shiftId}/employees")
    public Set<Employee> getEmployeesOfShift(@PathVariable Long shiftId) {
        return service.getEmployeesOfShift(shiftId);
    }

    @PostMapping("/send")
    public String sendMail(@RequestParam String to,@RequestParam String subject,@RequestParam String message) {
        mailService.sendSimpleMail(to, subject, message);
        return "Mail sent to " + to;
    }

    @GetMapping("/reset-week")
    public String testResetWeek() {
        service.resetWeekAndNotifyManager();
        return "resetWeekAndNotifyManager triggered";
    }

    @GetMapping("/send-weekly")
    public String testSendWeeklyShifts() {
        service.sendWeeklyShiftsToEmployees();
        return "sendWeeklyShiftsToEmployees triggered";
    }

}

