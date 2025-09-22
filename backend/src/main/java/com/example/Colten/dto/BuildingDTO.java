package com.example.Colten.dto;

import java.util.List;

public class BuildingDTO {
    private Long id;
    private String name;
    private List<UnitDTO> units;

    public BuildingDTO() {}

    public BuildingDTO(Long id, String name, List<UnitDTO> units) {
        this.id = id;
        this.name = name;
        this.units = units;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<UnitDTO> getUnits() { return units; }
    public void setUnits(List<UnitDTO> units) { this.units = units; }
}
