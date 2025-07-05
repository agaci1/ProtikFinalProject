package luxuryride.service;

import luxuryride.entities.Car;
import luxuryride.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarService {

    private final CarRepository repo;

    public CarService(CarRepository repo) {
        this.repo = repo;
    }

    public List<Car> getAllCars() {
        return repo.findAll();
    }

    public Optional<Car> getCarById(Long id) {
        return repo.findById(id);
    }

    public Car createCar(Car car) {
        return repo.save(car);
    }

    public Car updateCar(Long id, Car d) {
        return repo.findById(id).map(c -> {
            c.setBrand(d.getBrand());
            c.setModel(d.getModel());
            c.setType(d.getType());
            c.setPrice(d.getPrice());
            c.setAvailable(d.isAvailable());
            c.setForRent(d.isForRent());
            c.setForSale(d.isForSale());
            c.setYear(d.getYear());
            c.setMileage(d.getMileage());
            c.setFuel(d.getFuel());
            c.setImage(d.getImage());
            c.setDescription(d.getDescription());
            return repo.save(c);
        }).orElseThrow(() -> new RuntimeException("Car not found: " + id));
    }

    public void deleteCar(Long id) {
        repo.deleteById(id);
    }
}
