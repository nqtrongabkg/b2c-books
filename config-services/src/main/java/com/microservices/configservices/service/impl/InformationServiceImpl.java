package com.microservices.configservices.service.impl;

import com.microservices.configservices.entity.Information;
import com.microservices.configservices.payload.request.InformationRequest;
import com.microservices.configservices.payload.response.InfomationsResponse;
import com.microservices.configservices.repository.InformationRepository;
import com.microservices.configservices.service.InformationService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InformationServiceImpl implements InformationService {

    private final InformationRepository informationRepository;

    public InformationServiceImpl(InformationRepository informationRepository) {
        this.informationRepository = informationRepository;
    }

    @Override
    public InfomationsResponse create(InformationRequest informationRequest) {
        Information information = new Information();
        mapRequestToEntity(informationRequest, information);
        information.setCreatedAt(LocalDateTime.now());
        Information savedInformation = informationRepository.save(information);
        return mapInformationToInformationResponse(savedInformation);
    }

   @Override
    public void setImage(UUID id, String image) {
        Information information = informationRepository.findById(id).orElse(null);
        information.setLogo(image);
        informationRepository.save(information);
    }

    @Override
    public void switchStatus(UUID id) {
        Information information = informationRepository.findById(id).orElseThrow(() -> new RuntimeException("NOT_FOUND"));
        // Toggle the status value
        int currentStatus = information.getStatus();
        int newStatus = (currentStatus == 1) ? 0 : 1;
        information.setStatus(newStatus);
        informationRepository.save(information);
    }

    @Override
    public void trash(UUID id) {
        Information information = informationRepository.findById(id).orElseThrow(() -> new RuntimeException("NOT_FOUND"));
        // Set status to 2 (indicating trashed)
        information.setStatus(2);
        informationRepository.save(information);
    }

    @Override
    public void isDisplay(UUID id) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

         // Chuyển đổi giá trị của status
         int currentStatus = information.getStatus();
         int newStatus = (currentStatus == 3) ? 1 : 3;
         information.setStatus(newStatus);
         // Lưu trạng thái đã chuyển đổi
         informationRepository.save(information);
    }

    @Override
    public InfomationsResponse getById(UUID id) {
        Information information = informationRepository.findById(id).orElse(null);
        if (information != null) {
            return mapInformationToInformationResponse(information);
        }
        return null;
    }

    @Override
    public List<InfomationsResponse> getAll() {
        List<Information> informations = informationRepository.findAll();
        return informations.stream()
                .map(this::mapInformationToInformationResponse)
                .collect(Collectors.toList());
    }

    @Override
    public InfomationsResponse update(UUID id, InformationRequest informationRequest) {
        Information existingInformation = informationRepository.findById(id).orElse(null);
        if (existingInformation != null) {
            mapRequestToEntity(informationRequest, existingInformation);
            existingInformation.setUpdatedAt(LocalDateTime.now());
            Information updatedInformation = informationRepository.save(existingInformation);
            return mapInformationToInformationResponse(updatedInformation);
        }
        return null;
    }

    @Override
    public InfomationsResponse delete(UUID id) {
        Information information = informationRepository.findById(id).orElse(null);
        if (information != null) {
            informationRepository.delete(information);
            return mapInformationToInformationResponse(information);
        }
        return null;
    }

    @Override
    public InfomationsResponse getInformationDisplay() {
        Information information = informationRepository.findLatestInformationWithStatusThree()
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));
        return mapInformationToInformationResponse(information);
    }

    private InfomationsResponse mapInformationToInformationResponse(Information information) {
        if (information != null) {
            InfomationsResponse response = new InfomationsResponse();
            BeanUtils.copyProperties(information, response);
            return response;
        }
        return null;
    }

    private void mapRequestToEntity(InformationRequest informationRequest, Information information) {
        BeanUtils.copyProperties(informationRequest, information);
    }
}
