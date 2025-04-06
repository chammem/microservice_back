package tn.esprit.employesmicro.service;

import tn.esprit.employesmicro.entity.Employee;
import tn.esprit.employesmicro.entity.Shift;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface IService {
    public List<Employee>getAllEmployees();
    public Optional<Employee> getEmployeeById(Long id);
    public Employee addEmployee(Employee employee);
    public Employee updateEmployee(Employee employee);
    public void deleteEmployee(Long id);
    // SHIFT CRUD
    public List<Shift> getAllShifts();
    public Optional<Shift> getShiftById(Long id);
    public Shift addShift(Shift shift);
    public Shift updateShift(Shift shift);
    public void deleteShift(Long id);
    List<Shift> getShiftsOfEmployee(Long employeeId);

    Set<Employee> getEmployeesOfShift(Long shiftId);


    public Shift assignEmployeeToSHift(Long shiftId, Long employeeId);




}
