// package com.microservices.productservices.controller;

// import org.springframework.core.io.UrlResource;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import java.nio.file.Paths;
// import org.springframework.core.io.Resource;
// import org.springframework.http.MediaType;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import java.nio.file.Path;

// @RestController
// @RequestMapping("image-service/product-services/images")
// @CrossOrigin(origins = { "http://localhost:3000" })
// public class ImageController {

//     @GetMapping("/brands/{filename:.+}")
//     public ResponseEntity<Resource> getUserAvatar(@PathVariable String filename) {
//         try {
//             Path fileStorageLocation = Paths.get("src/main/resources/static/brands").toAbsolutePath().normalize();
//             Path filePath = fileStorageLocation.resolve(filename).normalize();
//             Resource resource = new UrlResource(filePath.toUri());

//             if (resource.exists() || resource.isReadable()) {
//                 return ResponseEntity.ok()
//                         .contentType(MediaType.IMAGE_JPEG) 
//                         .body(resource);
//             } else {
//                 throw new RuntimeException("Could not read the file!");
//             }
//         } catch (Exception e) {
//             throw new RuntimeException("Error: " + e.getMessage());
//         }
//     }

    
// }