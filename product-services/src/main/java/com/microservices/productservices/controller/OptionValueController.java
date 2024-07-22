package com.microservices.productservices.controller;

import com.microservices.productservices.payload.request.OptionValueRequest;
import com.microservices.productservices.payload.response.OptionValueResponse;
import com.microservices.productservices.service.OptionValueService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("product-services/api/option-values")
@CrossOrigin(origins = { "http://localhost:3000" })
public class OptionValueController {

    private final OptionValueService optionValueService;

    public OptionValueController(OptionValueService optionValueService) {
        this.optionValueService = optionValueService;
    }

    @PostMapping("/create")
    public ResponseEntity<OptionValueResponse> createOptionValue(@RequestBody OptionValueRequest optionValueRequest) {
        OptionValueResponse createdOptionValue = optionValueService.create(optionValueRequest);
        return new ResponseEntity<>(createdOptionValue, HttpStatus.CREATED);
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<OptionValueResponse> getOptionValueById(@PathVariable UUID id) {
        OptionValueResponse optionValue = optionValueService.getById(id);
        if (optionValue != null) {
            return ResponseEntity.ok(optionValue);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<OptionValueResponse>> getAllOptionValues() {
        List<OptionValueResponse> optionValues = optionValueService.getAll();
        return ResponseEntity.ok(optionValues);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OptionValueResponse> updateOptionValue(@RequestBody OptionValueRequest optionValueRequest, @PathVariable UUID id) {
        OptionValueResponse updatedOptionValue = optionValueService.update(id, optionValueRequest);
        if (updatedOptionValue != null) {
            return ResponseEntity.ok(updatedOptionValue);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<OptionValueResponse> deleteOptionValue(@PathVariable UUID id) {
        OptionValueResponse deletedOptionValue = optionValueService.delete(id);
        if (deletedOptionValue != null) {
            return ResponseEntity.ok(deletedOptionValue);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-by-option-id/{optionId}")
    public ResponseEntity<List<OptionValueResponse>> getOptionValuesByOptionId(@PathVariable UUID optionId) {
        List<OptionValueResponse> optionValues = optionValueService.findByOptionId(optionId);
        return ResponseEntity.ok(optionValues);
    }
}
