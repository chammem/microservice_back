package tn.esprit.employesmicro.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import tn.esprit.employesmicro.entity.Employee;
import tn.esprit.employesmicro.entity.Shift;
import tn.esprit.employesmicro.repository.EmployeeRepository;
import tn.esprit.employesmicro.repository.ShiftRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service

public class ServiceImpl implements IService{
    EmployeeRepository employeeRepos;
    ShiftRepository shiftRepos;
    private final JavaMailSender mailSender;
    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepos.findAll();
    }

    @Override
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepos.findById(id);
    }

    @Override
    public Employee addEmployee(Employee employee) {
        return employeeRepos.save(employee);
    }

    @Override
    public Employee updateEmployee(Employee employee) {
        Optional<Employee> existingEmployee = employeeRepos.findById(employee.getId());
        if (existingEmployee.isPresent()) {
            return employeeRepos.save(employee);
        }else{
            throw new EntityNotFoundException("Employee not found");
        }

    }

    @Override
    public void deleteEmployee(Long id) {
        employeeRepos.deleteById(id);
    }

    // SHIFT CRUD
    @Override
    public List<Shift> getAllShifts() {
        return shiftRepos.findAll();
    }

    @Override
    public Optional<Shift> getShiftById(Long id) {
        return shiftRepos.findById(id);
    }

    @Override
    public Shift addShift(Shift shift) {
        return shiftRepos.save(shift);
    }

    @Override
    public Shift updateShift(Shift shift) {
        Optional<Shift> existingShift = shiftRepos.findById(shift.getId());
        if (existingShift.isPresent()) {
            return shiftRepos.save(shift);
        } else {
            throw new EntityNotFoundException("Shift not found");
        }
    }

    @Override
    public void deleteShift(Long id) {
        shiftRepos.deleteById(id);
    }

    @Override
    public Shift assignEmployeeToSHift(Long shiftId,Long employeeId) {
        Shift shift = shiftRepos.findById(shiftId).get();
        Employee employee = employeeRepos.findById(employeeId).get();

        shift.getEmployees().add(employee);
        return shiftRepos.save(shift);
    }

    @Override
    public List<Shift> getShiftsOfEmployee(Long employeeId) {
        Employee employee = employeeRepos.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
        return List.copyOf(employee.getShifts());
    }
    @Override
    public Set<Employee> getEmployeesOfShift(Long shiftId) {
        Shift shift = shiftRepos.findById(shiftId)
                .orElseThrow(() -> new EntityNotFoundException("Shift not found"));
        return shift.getEmployees();
    }

    @Override
    @Scheduled(cron = "0 0 23 ? * SUN")
    public void resetWeekAndNotifyManager() {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

        System.out.println("resetWeekAndNotifyManager triggered on: " + today);
        System.out.println("Processing shifts between " + startOfWeek + " and " + endOfWeek);

        // Retrieve all shifts for the current week.
        List<Shift> shiftsToReset = shiftRepos.findAllByDateBetween(startOfWeek, endOfWeek);
        System.out.println("Found " + shiftsToReset.size() + " shift(s) to reset.");

        // Instead of deleting, mark each shift as archived.
        for (Shift shift : shiftsToReset) {
            shift.setArchived(true); // mark as archived
            shiftRepos.saveAndFlush(shift);  // force immediate update
            System.out.println("Archived shift with id: " + shift.getId() + ", date: " + shift.getDate());
        }

        // Get all employees with manager role.
        List<Employee> managers = employeeRepos.findAll().stream()
                .filter(emp -> "Manager".equalsIgnoreCase(emp.getPoste()))
                .collect(Collectors.toList());
        System.out.println("Found " + managers.size() + " manager(s).");

        String subject = "Weekly Shift Schedule Reset";
        StringBuilder body = new StringBuilder();
        body.append("The shifts for the week from ").append(startOfWeek)
                .append(" to ").append(endOfWeek)
                .append(" have been archived.\n\n")
                .append("Please fill in the new schedule for the upcoming week.");

        // Send email to each manager.
        for (Employee manager : managers) {
            System.out.println("Sending email to manager: " + manager.getEmail());
            sendEmail(manager.getEmail(), subject, body.toString());
        }
    }



    @Override
    @Scheduled(cron = "0 0 8 ? * MON")
    public void sendWeeklyShiftsToEmployees() {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

        // Fetch all shifts for the current week that are not archived.
        List<Shift> weeklyShifts = shiftRepos.findAllByDateBetween(startOfWeek, endOfWeek)
                .stream()
                .filter(shift -> !shift.isArchived())
                .collect(Collectors.toList());

        System.out.println("Weekly shifts found: " + weeklyShifts.size());

        // Get all employees.
        List<Employee> allEmployees = employeeRepos.findAll();
        System.out.println("Total employees: " + allEmployees.size());

        // For each employee, find shifts from the weeklyShifts list where the employee is assigned.
        for (Employee employee : allEmployees) {
            List<Shift> employeeShifts = weeklyShifts.stream()
                    .filter(shift -> shift.getEmployees() != null && shift.getEmployees().contains(employee))
                    .collect(Collectors.toList());

            if (!employeeShifts.isEmpty()) {
                String subject = "Your Weekly Shift Schedule";
                StringBuilder body = new StringBuilder();
                body.append("Hello ").append(employee.getNom()).append(",\n\n")
                        .append("Here is your schedule for the week from ")
                        .append(startOfWeek).append(" to ").append(endOfWeek).append(":\n\n");
                for (Shift shift : employeeShifts) {
                    body.append("- Date: ").append(shift.getDate())
                            .append(", Time: ").append(shift.getStartTime())
                            .append(" to ").append(shift.getEndTime())
                            .append(", Description: ").append(shift.getDescription())
                            .append("\n");
                }
                body.append("\nPlease contact your manager if you have any questions.");
                sendEmail(employee.getEmail(), subject, body.toString());
                System.out.println("Sent weekly shift email to: " + employee.getEmail());
            } else {
                System.out.println("No shifts assigned for employee: " + employee.getNom());
            }
        }
    }

    public void sendEmail(String to, String subject, String body) {
        try {
            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setFrom("ahmedjebari022@gmail.com"); // Should match your spring.mail.username
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending email to " + to + ": " + e.getMessage());
        }
    }


}
