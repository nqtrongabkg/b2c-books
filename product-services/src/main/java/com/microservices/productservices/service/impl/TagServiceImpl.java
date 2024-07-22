package com.microservices.productservices.service.impl;

import com.microservices.productservices.entity.Tag;
import com.microservices.productservices.payload.request.TagRequest;
import com.microservices.productservices.payload.response.TagResponse;
import com.microservices.productservices.repository.TagRepository;
import com.microservices.productservices.service.TagService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    public TagServiceImpl(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Override
    public TagResponse create(TagRequest tagRequest) {
        Tag tag = new Tag();
        mapRequestToEntity(tagRequest, tag);
        tag.setCreatedAt(LocalDateTime.now());
        Tag savedTag = tagRepository.save(tag);
        return mapTagToTagResponse(savedTag);
    }

    @Override
    public void setImage(UUID id, String image){
        Tag tag = tagRepository.findById(id).orElse(null);
        tag.setImage(image);
        tagRepository.save(tag);
    }

    @Override
    public void switchStatus(UUID id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Chuyển đổi giá trị của status
        int currentStatus = tag.getStatus();
        int newStatus = (currentStatus == 1) ? 0 : 1;
        tag.setStatus(newStatus);
        // Lưu trạng thái đã chuyển đổi
        tagRepository.save(tag);
    }

    @Override
    public void trash(UUID id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

        // Đặt trạng thái thành 2
        tag.setStatus(2);

        // Lưu trạng thái đã thay đổi
        tagRepository.save(tag);
    }

    @Override
    public void isDisplay(UUID id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOT_FOUND"));

         // Chuyển đổi giá trị của status
         int currentStatus = tag.getStatus();
         int newStatus = (currentStatus == 3) ? 1 : 3;
         tag.setStatus(newStatus);
         // Lưu trạng thái đã chuyển đổi
         tagRepository.save(tag);
    }

    @Override
    public TagResponse getById(UUID id) {
        Tag tag = tagRepository.findById(id).orElse(null);
        if (tag != null) {
            return mapTagToTagResponse(tag);
        }
        return null;
    }

    @Override
    public List<TagResponse> getAll() {
        List<Tag> tags = tagRepository.findAll();
        return tags.stream()
                .map(this::mapTagToTagResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TagResponse update(UUID id, TagRequest tagRequest) {
        Tag existingTag = tagRepository.findById(id).orElse(null);
        if (existingTag != null) {
            mapRequestToEntity(tagRequest, existingTag);
            existingTag.setUpdatedAt(LocalDateTime.now());
            Tag updatedTag = tagRepository.save(existingTag);
            return mapTagToTagResponse(updatedTag);
        }
        return null;
    }

    @Override
    public TagResponse delete(UUID id) {
        Tag tag = tagRepository.findById(id).orElse(null);
        if (tag != null) {
            tagRepository.delete(tag);
            return mapTagToTagResponse(tag);
        }
        return null;
    }

    private TagResponse mapTagToTagResponse(Tag tag) {
        if (tag != null) {
            return TagResponse.builder()
                    .id(tag.getId())
                    .name(tag.getName())
                    .image(tag.getImage())
                    .description(tag.getDescription())
                    .createdAt(tag.getCreatedAt())
                    .updatedAt(tag.getUpdatedAt())
                    .createdBy(tag.getCreatedBy())
                    .updatedBy(tag.getUpdatedBy())
                    .status(tag.getStatus())
                    .build();
        }
        return null;
    }

    private void mapRequestToEntity(TagRequest tagRequest, Tag tag) {
        BeanUtils.copyProperties(tagRequest, tag);
    }
}
