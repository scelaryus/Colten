package com.example.Colten.service;

import com.example.Colten.dto.AuthResponse;
import com.example.Colten.dto.LoginRequest;
import com.example.Colten.dto.RegisterRequest;
import com.example.Colten.model.Owner;
import com.example.Colten.model.Role;
import com.example.Colten.model.User;
import com.example.Colten.repository.OwnerRepository;
import com.example.Colten.repository.UserRepository;
import com.example.Colten.security.JwtUtils;
import com.example.Colten.service.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    OwnerRepository ownerRepository;
    
    @Autowired
    PasswordEncoder encoder;
    
    @Autowired
    JwtUtils jwtUtils;
    
    public ResponseEntity<?> authenticateUser(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), 
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findByEmail(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            AuthResponse response = new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse("Error: Invalid email or password!"));
        }
    }
    
    @Transactional
    public ResponseEntity<?> registerUser(RegisterRequest signUpRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse("Error: Email is already in use!"));
        }
        
        try {
            User savedUser;
            
            // If user is an owner, create owner directly
            if (signUpRequest.getRole() == Role.OWNER) {
                Owner owner = new Owner(
                    signUpRequest.getFirstName(),
                    signUpRequest.getLastName(),
                    signUpRequest.getEmail(),
                    encoder.encode(signUpRequest.getPassword()),
                    signUpRequest.getCompanyName()
                );
                
                if (signUpRequest.getPhone() != null) {
                    owner.setPhone(signUpRequest.getPhone());
                }
                owner.setBusinessLicense(signUpRequest.getBusinessLicense());
                owner.setTaxId(signUpRequest.getTaxId());
                owner.setBio(signUpRequest.getBio());
                
                savedUser = ownerRepository.save(owner);
            } else {
                // Create regular user (tenant will be created later when they get a room code)
                User user = new User(
                    signUpRequest.getFirstName(),
                    signUpRequest.getLastName(),
                    signUpRequest.getEmail(),
                    encoder.encode(signUpRequest.getPassword()),
                    signUpRequest.getRole()
                );
                
                if (signUpRequest.getPhone() != null) {
                    user.setPhone(signUpRequest.getPhone());
                }
                
                savedUser = userRepository.save(user);
            }
            
            // Generate JWT token for immediate login
            String jwt = jwtUtils.generateTokenFromUsername(savedUser.getEmail());
            
            AuthResponse response = new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getRole()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse("Error: Could not create user account. " + e.getMessage()));
        }
    }
}
