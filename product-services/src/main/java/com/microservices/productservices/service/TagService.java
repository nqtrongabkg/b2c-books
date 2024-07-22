package com.microservices.productservices.service;

import com.microservices.productservices.payload.request.TagRequest;
import com.microservices.productservices.payload.response.TagResponse;

import java.util.List;
import java.util.UUID;

public interface TagService {

    TagResponse create(TagRequest tagRequest);

    void setImage(UUID id, String image);

    void switchStatus(UUID id);

    void trash(UUID id);

    void isDisplay(UUID id);

    TagResponse getById(UUID id);

    List<TagResponse> getAll();

    TagResponse update(UUID id, TagRequest tagRequest);

    TagResponse delete(UUID id);
}
