package com.datamate.operator.interfaces.api;

import com.datamate.common.infrastructure.common.Response;
import com.datamate.common.interfaces.PagedResponse;
import com.datamate.operator.application.OperatorService;
import com.datamate.operator.interfaces.dto.CreateOperatorRequest;
import com.datamate.operator.interfaces.dto.OperatorResponse;
import com.datamate.operator.interfaces.dto.OperatorsListPostRequest;
import com.datamate.operator.interfaces.dto.UpdateOperatorRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/operators")
@RequiredArgsConstructor
public class OperatorController {
    private final OperatorService operatorService;

    @PostMapping("/list")
    public ResponseEntity<Response<PagedResponse<OperatorResponse>>> operatorsListPost(@RequestBody OperatorsListPostRequest request) {
        List<OperatorResponse> responses = operatorService.getOperators(request.getPage(), request.getSize(),
                request.getCategories(), request.getOperatorName(), request.getIsStar());
        int count = operatorService.getOperatorsCount(request.getCategories(), request.getOperatorName(),
                request.getIsStar());
        int totalPages = (count + request.getSize() + 1) / request.getSize();
        return ResponseEntity.ok(Response.ok(PagedResponse.of(responses, request.getPage(), count, totalPages)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<OperatorResponse>> operatorsIdGet(@PathVariable("id") String id) {
        return ResponseEntity.ok(Response.ok(operatorService.getOperatorById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response<OperatorResponse>> operatorsIdPut(@PathVariable("id") String id,
                                                                     @RequestBody UpdateOperatorRequest updateOperatorRequest) {
        return ResponseEntity.ok(Response.ok(operatorService.updateOperator(id, updateOperatorRequest)));
    }

    @PostMapping("/create")
    public ResponseEntity<Response<OperatorResponse>> operatorsCreatePost(@RequestBody CreateOperatorRequest createOperatorRequest) {
        return ResponseEntity.ok(Response.ok(operatorService.createOperator(createOperatorRequest)));
    }

    @PostMapping("/upload")
    public ResponseEntity<Response<OperatorResponse>> operatorsUploadPost(@RequestPart(value = "file") MultipartFile file,
                                                                          @RequestParam(value = "description") String description) {
        return ResponseEntity.ok(Response.ok(operatorService.uploadOperator(file, description)));
    }
}
