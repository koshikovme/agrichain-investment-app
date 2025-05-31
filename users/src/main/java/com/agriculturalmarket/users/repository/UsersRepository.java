package com.agriculturalmarket.users.repository;

import com.agriculturalmarket.users.entity.users.Users;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByUserId(Long investmentId);

    Optional<Users> findByMobileNumber(String mobileNumber);

    @Modifying
    @Transactional
    void deleteByMobileNumber(String mobileNumber);


    @Transactional
    @Modifying
    void deleteByUserId(Long userId);
}
