package tn.esprit.employesmicro.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import tn.esprit.employesmicro.entity.Employee;
import tn.esprit.employesmicro.entity.Shift;
import tn.esprit.employesmicro.repository.EmployeeRepository;
import tn.esprit.employesmicro.repository.ShiftRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@AllArgsConstructor
@Service

public class ServiceImpl implements IService{
    EmployeeRepository employeeRepos;
    ShiftRepository shiftRepos;

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




}
