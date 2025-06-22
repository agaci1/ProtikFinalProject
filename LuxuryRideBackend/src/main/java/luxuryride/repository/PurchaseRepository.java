package luxuryride.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import luxuryride.entities.Purchase;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
}

