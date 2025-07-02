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

    public Car updateCar(Long id, Car carDetails) {
        return repo.findById(id).map(car -> {
            car.setBrand(carDetails.getBrand());
            car.setModel(carDetails.getModel());
            car.setPlates(carDetails.getPlates());
            car.setPrice(carDetails.getPrice());
            car.setAvailable(carDetails.isAvailable());
            car.setForRent(carDetails.isForRent());
            car.setForSale(carDetails.isForSale());
            car.setDescription(carDetails.getDescription());
            return repo.save(car);
        }).orElseThrow(() -> new RuntimeException("Car not found with id: " + id));
    }

    public void deleteCar(Long id) {
        repo.deleteById(id);
    }
}

