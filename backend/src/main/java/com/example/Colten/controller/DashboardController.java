package com.example.Colten.controller;

import com.example.Colten.model.IssueStatus;
import com.example.Colten.model.Tenant;
import com.example.Colten.model.Owner;
import com.example.Colten.repository.BuildingRepository;
import com.example.Colten.repository.IssueRepository;
import com.example.Colten.repository.PaymentRepository;
import com.example.Colten.repository.TenantRepository;
import com.example.Colten.repository.UnitRepository;
import com.example.Colten.repository.OwnerRepository;
import com.example.Colten.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private JwtUtils jwtUtils;

    // Owner Dashboard Summary
    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> getOwnerDashboard(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);

            // Get payment stats (these methods exist)
            BigDecimal monthlyRev = paymentRepository.getTotalMonthlyRevenueByOwnerEmail(email);
            BigDecimal totalRev = paymentRepository.getTotalRevenueByOwnerEmail(email);
            Long pendingPay = paymentRepository.countPendingPaymentsByOwnerEmail(email);
            Long openIss = issueRepository.countOpenIssuesByOwnerEmail(email);

            var dashboard = new Object() {
                public final BigDecimal monthlyRevenue = monthlyRev != null ? monthlyRev : BigDecimal.ZERO;
                public final BigDecimal totalRevenue = totalRev != null ? totalRev : BigDecimal.ZERO;
                public final Long pendingPayments = pendingPay != null ? pendingPay : 0L;
                public final Long openIssues = openIss != null ? openIss : 0L;
                public final String message = "Dashboard data available";
            };

            return ResponseEntity.ok(dashboard);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not retrieve owner dashboard. " + e.getMessage());
        }
    }

    // Tenant Dashboard Summary
    @GetMapping("/tenant")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<?> getTenantDashboard(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);

            // Get tenant using the correct repository method
            Optional<Tenant> tenantOpt = tenantRepository.findByEmail(email);
            if (tenantOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Error: Tenant not found");
            }

            Tenant tenant = tenantOpt.get();
            
            // Get issues and payments using existing methods
            var issuesList = issueRepository.findByTenantOrderByCreatedAtDesc(tenant);
            var paymentsList = paymentRepository.findByTenantOrderByPaymentDateDesc(tenant);

            // Unit info
            var unit = tenant.getUnit();
            String unitNum = unit != null ? unit.getUnitNumber() : "Not Assigned";
            String buildingNm = unit != null && unit.getBuilding() != null ? unit.getBuilding().getName() : "Not Assigned";
            BigDecimal monthlyRt = unit != null ? unit.getMonthlyRent() : BigDecimal.ZERO;

            var dashboard = new Object() {
                public final String unitNumber = unitNum;
                public final String buildingName = buildingNm;
                public final BigDecimal monthlyRent = monthlyRt;
                public final Long totalIssues = (long) issuesList.size();
                public final Long totalPayments = (long) paymentsList.size();
                public final boolean hasUnit = unit != null;
            };

            return ResponseEntity.ok(dashboard);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not retrieve tenant dashboard. " + e.getMessage());
        }
    }

    // Building Performance Summary
    @GetMapping("/building/{buildingId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> getBuildingDashboard(@PathVariable Long buildingId,
                                                @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);

            // Get building and verify ownership
            var buildingOpt = buildingRepository.findById(buildingId);
            if (buildingOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            var building = buildingOpt.get();
            if (!building.getOwner().getEmail().equals(email)) {
                return ResponseEntity.status(403)
                    .body("Error: You don't have permission to view this building");
            }

            // Get basic building data
            var unitsList = unitRepository.findByBuildingId(buildingId);
            var issuesList = issueRepository.findByUnit_Building_IdOrderByCreatedAtDesc(buildingId);
            var paymentsList = paymentRepository.findByUnit_Building_IdOrderByPaymentDateDesc(buildingId);

            var dashboard = new Object() {
                public final String buildingName = building.getName();
                public final Long totalUnits = (long) unitsList.size();
                public final Long totalIssues = (long) issuesList.size();
                public final Long totalPayments = (long) paymentsList.size();
            };

            return ResponseEntity.ok(dashboard);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: Could not retrieve building dashboard. " + e.getMessage());
        }
    }
}
