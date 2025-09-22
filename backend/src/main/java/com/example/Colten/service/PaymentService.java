package com.example.Colten.service;

import com.example.Colten.dto.PaymentRequest;
import com.example.Colten.model.Payment;
import com.example.Colten.model.PaymentStatus;
import com.example.Colten.model.Tenant;
import com.example.Colten.model.Unit;
import com.example.Colten.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Value("${stripe.secret.key:sk_test_...}")
    private String stripeSecretKey;

    public PaymentService() {
        // Initialize Stripe with the secret key
        // In production, this should be set through application properties
        Stripe.apiKey = stripeSecretKey;
    }

    public Payment processStripePayment(PaymentRequest paymentRequest, Tenant tenant, Unit unit) throws StripeException {
        try {
            // Convert amount to cents for Stripe (Stripe expects amounts in smallest currency unit)
            long amountInCents = paymentRequest.getAmount().multiply(BigDecimal.valueOf(100)).longValue();

            // Create Stripe Payment Intent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .setDescription("Rent payment for " + unit.getUnitNumber() + " - " + unit.getBuilding().getName())
                .putMetadata("tenant_id", tenant.getId().toString())
                .putMetadata("unit_id", unit.getId().toString())
                .putMetadata("building_id", unit.getBuilding().getId().toString())
                .setPaymentMethod(paymentRequest.getStripePaymentMethodId())
                .setConfirmationMethod(PaymentIntentCreateParams.ConfirmationMethod.MANUAL)
                .setConfirm(true)
                .build();

            PaymentIntent intent = PaymentIntent.create(params);

            // Create payment record
            Payment payment = new Payment();
            payment.setTenant(tenant);
            payment.setUnit(unit);
            payment.setAmount(paymentRequest.getAmount());
            payment.setPaymentType(paymentRequest.getPaymentType());
            payment.setPaymentMethod(paymentRequest.getPaymentMethod());
            payment.setPaymentDate(LocalDateTime.now());
            payment.setDueDate(paymentRequest.getDueDate());
            payment.setPaymentPeriodStart(paymentRequest.getPaymentPeriodStart());
            payment.setPaymentPeriodEnd(paymentRequest.getPaymentPeriodEnd());
            payment.setDescription(paymentRequest.getDescription());
            payment.setStripePaymentIntentId(intent.getId());
            payment.setReferenceNumber(generateReferenceNumber());
            payment.setCreatedAt(LocalDateTime.now());

            // Set status based on Stripe response
            if ("succeeded".equals(intent.getStatus())) {
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setProcessedAt(LocalDateTime.now());
                payment.setStripeChargeId(intent.getLatestCharge());
            } else if ("requires_action".equals(intent.getStatus())) {
                payment.setStatus(PaymentStatus.PENDING);
            } else {
                payment.setStatus(PaymentStatus.FAILED);
            }

            return paymentRepository.save(payment);

        } catch (StripeException e) {
            // Create failed payment record
            Payment payment = new Payment();
            payment.setTenant(tenant);
            payment.setUnit(unit);
            payment.setAmount(paymentRequest.getAmount());
            payment.setPaymentType(paymentRequest.getPaymentType());
            payment.setPaymentMethod(paymentRequest.getPaymentMethod());
            payment.setPaymentDate(LocalDateTime.now());
            payment.setStatus(PaymentStatus.FAILED);
            payment.setDescription("Payment failed: " + e.getMessage());
            payment.setReferenceNumber(generateReferenceNumber());
            payment.setCreatedAt(LocalDateTime.now());

            paymentRepository.save(payment);
            throw e;
        }
    }

    public Payment confirmStripePayment(String paymentIntentId) throws StripeException {
        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
        intent = intent.confirm();

        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntentId);
        if (payment != null) {
            if ("succeeded".equals(intent.getStatus())) {
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setProcessedAt(LocalDateTime.now());
                payment.setStripeChargeId(intent.getLatestCharge());
            } else if ("requires_action".equals(intent.getStatus())) {
                payment.setStatus(PaymentStatus.PENDING);
            } else {
                payment.setStatus(PaymentStatus.FAILED);
            }
            
            payment.setUpdatedAt(LocalDateTime.now());
            return paymentRepository.save(payment);
        }

        throw new RuntimeException("Payment not found for PaymentIntent: " + paymentIntentId);
    }

    public Payment refundPayment(Long paymentId, BigDecimal refundAmount, String reason) throws StripeException {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStripeChargeId() == null) {
            throw new RuntimeException("Cannot refund payment without Stripe charge ID");
        }

        // Process refund through Stripe
        com.stripe.param.RefundCreateParams params = com.stripe.param.RefundCreateParams.builder()
            .setCharge(payment.getStripeChargeId())
            .setAmount(refundAmount.multiply(BigDecimal.valueOf(100)).longValue()) // Convert to cents
            .setReason(com.stripe.param.RefundCreateParams.Reason.REQUESTED_BY_CUSTOMER)
            .putMetadata("reason", reason)
            .build();

        com.stripe.model.Refund.create(params);

        // Update payment record
        if (refundAmount.compareTo(payment.getAmount()) == 0) {
            payment.setStatus(PaymentStatus.REFUNDED);
        } else {
            payment.setStatus(PaymentStatus.PARTIALLY_REFUNDED);
        }

        payment.setRefundAmount(refundAmount);
        payment.setRefundDate(LocalDateTime.now());
        payment.setRefundReason(reason);
        payment.setUpdatedAt(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    private String generateReferenceNumber() {
        return "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public boolean isRentPaidForCurrentMonth(Long tenantId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime monthStart = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime monthEnd = monthStart.plusMonths(1).minusNanos(1);

        return paymentRepository.isRentPaidForPeriod(tenantId, monthStart, monthEnd);
    }

    public Payment getLatestRentPayment(Long tenantId) {
        return paymentRepository.findLatestRentPaymentByTenantId(tenantId);
    }
}
