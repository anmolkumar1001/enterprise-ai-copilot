package com.anmol.backend.service;

import com.anmol.backend.dto.LoginRequest;
import com.anmol.backend.dto.RegisterRequest;
import com.anmol.backend.entity.User;
import com.anmol.backend.repository.UserRepository;
import com.anmol.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User registerUser(RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole("USER");

        user.setPassword(
                bCryptPasswordEncoder.encode(request.getPassword())
        );

        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already exists");
        }

        return userRepository.save(user);
    }

    public String login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        boolean matched =
                bCryptPasswordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if(!matched) {
            throw new RuntimeException("Invalid password");
        }

//        return "Login Successful";
        return jwtUtil.generateToken(user.getEmail());
    }
}
