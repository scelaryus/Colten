package com.example.Colten.repository;

import com.example.Colten.model.Payment;
import com.example.Colten.model.PaymentStatus;
import com.example.Colten.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    // Find payments by tenant
    List<Payment> findByTenantOrderByPaymentDateDesc(Tenant tenant);
    List<Payment> findByTenantIdOrderByPaymentDateDesc(Long tenantId);
    
    // Find payments by unit
    List<Payment> findByUnitIdOrderByPaymentDateDesc(Long unitId);
    
    // Find payments by building
    List<Payment> findByUnit_Building_IdOrderByPaymentDateDesc(Long buildingId);
    
    // Find payments by owner's email
    @Query("SELECT p FROM Payment p WHERE p.unit.building.owner.email = :ownerEmail ORDER BY p.paymentDate DESC")
    List<Payment> findByUnit_Building_Owner_EmailOrderByPaymentDateDesc(@Param("ownerEmail") String ownerEmail);
    
    // Find payments by status
    List<Payment> findByStatusOrderByPaymentDateDesc(PaymentStatus status);
    
    // Find pending payments for an owner
    @Query("SELECT p FROM Payment p WHERE p.unit.building.owner.email = :ownerEmail AND p.status IN ('PENDING', 'FAILED') ORDER BY p.dueDate ASC")
    List<Payment> findPendingPaymentsByOwnerEmail(@Param("ownerEmail") String ownerEmail);
    
    // Find overdue payments
    @Query("SELECT p FROM Payment p WHERE p.dueDate < CURRENT_TIMESTAMP AND p.status = 'PENDING' ORDER BY p.dueDate ASC")
    List<Payment> findOverduePayments();
    
    // Get total monthly revenue for owner
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.unit.building.owner.email = :ownerEmail AND p.status = 'COMPLETED' AND YEAR(p.paymentDate) = YEAR(CURRENT_DATE) AND MONTH(p.paymentDate) = MONTH(CURRENT_DATE)")
    BigDecimal getTotalMonthlyRevenueByOwnerEmail(@Param("ownerEmail") String ownerEmail);
    
    // Get total revenue for owner
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.unit.building.owner.email = :ownerEmail AND p.status = 'COMPLETED'")
    BigDecimal getTotalRevenueByOwnerEmail(@Param("ownerEmail") String ownerEmail);
    
    // Count total payments for owner
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.unit.building.owner.email = :ownerEmail")
    Long countPaymentsByOwnerEmail(@Param("ownerEmail") String ownerEmail);
    
    // Count pending payments for owner
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.unit.building.owner.email = :ownerEmail AND p.status IN ('PENDING', 'FAILED')")
    Long countPendingPaymentsByOwnerEmail(@Param("ownerEmail") String ownerEmail);
    
    // Find payments by date range
    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate ORDER BY p.paymentDate DESC")
    List<Payment> findByPaymentDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find rent payments for a tenant
    @Query("SELECT p FROM Payment p WHERE p.tenant.id = :tenantId AND p.paymentType = 'RENT' ORDER BY p.paymentDate DESC")
    List<Payment> findRentPaymentsByTenantId(@Param("tenantId") Long tenantId);
    
    // Find latest rent payment for a tenant
    @Query("SELECT p FROM Payment p WHERE p.tenant.id = :tenantId AND p.paymentType = 'RENT' AND p.status = 'COMPLETED' ORDER BY p.paymentDate DESC LIMIT 1")
    Payment findLatestRentPaymentByTenantId(@Param("tenantId") Long tenantId);
    
    // Check if rent is paid for specific period
    @Query("SELECT COUNT(p) > 0 FROM Payment p WHERE p.tenant.id = :tenantId AND p.paymentType = 'RENT' AND p.status = 'COMPLETED' AND p.paymentPeriodStart = :periodStart AND p.paymentPeriodEnd = :periodEnd")
    boolean isRentPaidForPeriod(@Param("tenantId") Long tenantId, @Param("periodStart") LocalDateTime periodStart, @Param("periodEnd") LocalDateTime periodEnd);
    
    // Find payments by Stripe payment intent ID
    Payment findByStripePaymentIntentId(String stripePaymentIntentId);
    
    // Find payments by reference number
    Payment findByReferenceNumber(String referenceNumber);
}
