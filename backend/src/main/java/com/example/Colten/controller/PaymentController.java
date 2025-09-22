package com.example.Colten.controller;

import com.example.Colten.dto.PaymentRequest;
import com.example.Colten.model.Payment;
import com.example.Colten.model.PaymentStatus;
import com.example.Colten.model.Tenant;
import com.example.Colten.model.Unit;
import com.example.Colten.repository.PaymentRepository;
import com.example.Colten.repository.TenantRepository;
import com.example.Colten.repository.UnitRepository;
import com.example.Colten.repository.UserRepository;
import com.example.Colten.security.JwtUtils;
import com.example.Colten.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    // Process a rent payment (Tenant only)
    @PostMapping("/process")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<?> processPayment(@Valid @RequestBody PaymentRequest paymentRequest,
                                          @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Tenant> tenantOpt = tenantRepository.findByEmail(email);
            if (tenantOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Error: Tenant not found");
            }

            Tenant tenant = tenantOpt.get();
            if (tenant.getUnit() == null) {
                return ResponseEntity.badRequest()
                    .body("Error: You must be assigned to a unit to make payments");
            }

            Unit unit = tenant.getUnit();

            // Process payment through Stripe
            Payment payment = paymentService.processStripePayment(paymentRequest, tenant, unit);
            
            return ResponseEntity.ok(payment);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not process payment. " + e.getMessage());
        }
    }

    // Get payment history for a tenant
    @GetMapping("/my-payments")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<?> getMyPayments(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Tenant> tenantOpt = tenantRepository.findByEmail(email);
            if (tenantOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Error: Tenant not found");
            }

            List<Payment> payments = paymentRepository.findByTenantOrderByPaymentDateDesc(tenantOpt.get());
            return ResponseEntity.ok(payments);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not retrieve payments. " + e.getMessage());
        }
    }

    // Get payments for a building (Owner only)
    @GetMapping("/building/{buildingId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> getBuildingPayments(@PathVariable Long buildingId,
                                               @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            List<Payment> payments = paymentRepository.findByUnit_Building_IdOrderByPaymentDateDesc(buildingId);
            return ResponseEntity.ok(payments);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not retrieve building payments. " + e.getMessage());
        }
    }

    // Get all payments for owner's properties
    @GetMapping("/owner-payments")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> getOwnerPayments(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            List<Payment> payments = paymentRepository.findByUnit_Building_Owner_EmailOrderByPaymentDateDesc(email);
            return ResponseEntity.ok(payments);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not retrieve payments. " + e.getMessage());
        }
    }

    // Get pending payments (late payments)
    @GetMapping("/pending")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> getPendingPayments(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            List<Payment> payments = paymentRepository.findPendingPaymentsByOwnerEmail(email);
            return ResponseEntity.ok(payments);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not retrieve pending payments. " + e.getMessage());
        }
    }

    // Record a manual payment (Owner only)
    @PostMapping("/manual")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> recordManualPayment(@Valid @RequestBody PaymentRequest paymentRequest,
                                               @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            // Verify tenant exists
            Tenant tenant = tenantRepository.findById(paymentRequest.getTenantId())
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

            Unit unit = unitRepository.findById(paymentRequest.getUnitId())
                .orElseThrow(() -> new RuntimeException("Unit not found"));

            // Verify owner owns this building
            if (!unit.getBuilding().getOwner().getEmail().equals(email)) {
                return ResponseEntity.status(403)
                    .body("Error: You don't have permission to record payments for this unit");
            }

            Payment payment = new Payment();
            payment.setTenant(tenant);
            payment.setUnit(unit);
            payment.setAmount(paymentRequest.getAmount());
            payment.setPaymentType(paymentRequest.getPaymentType());
            payment.setPaymentMethod(paymentRequest.getPaymentMethod());
            payment.setPaymentDate(LocalDateTime.now());
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setDescription(paymentRequest.getDescription());
            payment.setNotes("Manual payment recorded by owner");
            payment.setCreatedAt(LocalDateTime.now());

            Payment savedPayment = paymentRepository.save(payment);
            return ResponseEntity.ok(savedPayment);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not record manual payment. " + e.getMessage());
        }
    }

    // Get payment details by ID
    @GetMapping("/{paymentId}")
    @PreAuthorize("hasRole('TENANT') or hasRole('OWNER')")
    public ResponseEntity<?> getPayment(@PathVariable Long paymentId,
                                      @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

            // Check permissions
            boolean canAccess = false;
            if (payment.getTenant().getEmail().equals(email)) {
                canAccess = true; // Tenant can see their own payments
            } else if (payment.getUnit().getBuilding().getOwner().getEmail().equals(email)) {
                canAccess = true; // Owner can see payments for their properties
            }

            if (!canAccess) {
                return ResponseEntity.status(403)
                    .body("Error: You don't have permission to view this payment");
            }

            return ResponseEntity.ok(payment);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not retrieve payment. " + e.getMessage());
        }
    }

    // Get payment statistics for owner dashboard
    @GetMapping("/stats")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> getPaymentStats(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            // Calculate various payment statistics
            BigDecimal monthlyRevenue = paymentRepository.getTotalMonthlyRevenueByOwnerEmail(email);
            Long totalPaymentsCount = paymentRepository.countPaymentsByOwnerEmail(email);
            Long pendingPaymentsCount = paymentRepository.countPendingPaymentsByOwnerEmail(email);
            BigDecimal totalRevenueAmount = paymentRepository.getTotalRevenueByOwnerEmail(email);

            // Create response object
            var stats = new Object() {
                public final BigDecimal totalMonthlyRevenue = monthlyRevenue != null ? monthlyRevenue : BigDecimal.ZERO;
                public final Long totalPayments = totalPaymentsCount != null ? totalPaymentsCount : 0L;
                public final Long pendingPayments = pendingPaymentsCount != null ? pendingPaymentsCount : 0L;
                public final BigDecimal totalRevenue = totalRevenueAmount != null ? totalRevenueAmount : BigDecimal.ZERO;
            };

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not retrieve payment statistics. " + e.getMessage());
        }
    }
}
