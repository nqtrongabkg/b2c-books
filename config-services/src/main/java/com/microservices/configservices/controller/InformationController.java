package com.microservices.configservices.controller;

import com.microservices.configservices.payload.request.InformationRequest;
import com.microservices.configservices.payload.request.SetImageRequest;
import com.microservices.configservices.payload.response.InfomationsResponse;
import com.microservices.configservices.service.InformationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/config-services/api/informations")
@CrossOrigin(origins = { "http://localhost:3000" })
public class InformationController {

    private final InformationService informationService;

    public InformationController(InformationService informationService) {
        this.informationService = informationService;
    }

    @PostMapping("/create")
    public ResponseEntity<InfomationsResponse> createInformation(@RequestBody InformationRequest informationRequest) {
        InfomationsResponse createdInformation = informationService.create(informationRequest);
        return new ResponseEntity<>(createdInformation, HttpStatus.CREATED);
    }

    @PutMapping("/set-image")
    public ResponseEntity<Void> setImage(@RequestBody SetImageRequest setImageRequest) {
        informationService.setImage(setImageRequest.getId(), setImageRequest.getImage());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/switch-status/{id}")
    public ResponseEntity<Void> switchStatus(@PathVariable UUID id) {
        informationService.switchStatus(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/trash/{id}")
    public ResponseEntity<Void> trash(@PathVariable UUID id) {
        informationService.trash(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/display/{id}")
    public ResponseEntity<Void> display(@PathVariable UUID id) {
        informationService.isDisplay(id);
        return ResponseEntity.ok().build();
    }  

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<InfomationsResponse> getInformationById(@PathVariable UUID id) {
        InfomationsResponse information = informationService.getById(id);
        if (information != null) {
            return ResponseEntity.ok(information);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<InfomationsResponse>> getAllInformations() {
        List<InfomationsResponse> informations = informationService.getAll();
        return ResponseEntity.ok(informations);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<InfomationsResponse> updateInformation(@PathVariable UUID id, @RequestBody InformationRequest informationRequest) {
        InfomationsResponse updatedInformation = informationService.update(id, informationRequest);
        if (updatedInformation != null) {
            return ResponseEntity.ok(updatedInformation);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<InfomationsResponse> deleteInformation(@PathVariable UUID id) {
        InfomationsResponse deletedInformation = informationService.delete(id);
        if (deletedInformation != null) {
            return ResponseEntity.ok(deletedInformation);
        }
        return ResponseEntity.notFound().build();
    }
    @GetMapping("/get-display")
    public ResponseEntity<InfomationsResponse> getInformationDisplay() {
        InfomationsResponse information = informationService.getInformationDisplay();
        if (information != null) {
            return ResponseEntity.ok(information);
        }
        return ResponseEntity.notFound().build();
    }
}
