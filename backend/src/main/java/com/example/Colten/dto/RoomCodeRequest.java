package com.example.Colten.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RoomCodeRequest {
    
    @NotBlank(message = "Room code is required")
    @Size(min = 8, max = 8, message = "Room code must be exactly 8 characters")
    private String roomCode;

    public RoomCodeRequest() {}

    public RoomCodeRequest(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }
}
