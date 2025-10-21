package com.datamate.operator.application;

import com.datamate.operator.domain.converter.OperatorConverter;
import com.datamate.operator.infrastructure.persistence.mapper.CategoryRelationMapper;
import com.datamate.operator.infrastructure.persistence.mapper.OperatorMapper;
import com.datamate.operator.interfaces.dto.CreateOperatorRequest;
import com.datamate.operator.interfaces.dto.OperatorResponse;
import com.datamate.operator.interfaces.dto.UpdateOperatorRequest;
import com.datamate.operator.interfaces.dto.*;
import com.datamate.operator.domain.modal.Operator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OperatorService {
    private final OperatorMapper operatorMapper;

    private final CategoryRelationMapper relationMapper;

    public List<OperatorResponse> getOperators(Integer page, Integer size, List<Integer> categories,
                                               String operatorName, Boolean isStar) {
        Integer offset = page * size;
        List<Operator> filteredOperators = operatorMapper.findOperatorsByCriteria(size, offset, operatorName,
                categories, isStar);
        return filteredOperators.stream()
                .map(OperatorConverter.INSTANCE::operatorToResponse).toList();
    }

    public int getOperatorsCount(List<Integer> categories, String operatorName, Boolean isStar) {
        return operatorMapper.countOperatorsByCriteria(operatorName, categories, isStar);
    }

    public OperatorResponse getOperatorById(String id) {
        Operator operator = operatorMapper.findOperatorById(id);
        return OperatorConverter.INSTANCE.operatorToResponse(operator);
    }

    public OperatorResponse createOperator(CreateOperatorRequest req) {
        Operator operator = new Operator();
        operator.setId(req.getId());
        operator.setName(req.getName());
        operator.setDescription(req.getDescription());
        operator.setVersion(req.getVersion());
        operator.setInputs(req.getInputs());
        operator.setOutputs(req.getOutputs());
        operator.setRuntime(req.getRuntime());
        operator.setSettings(req.getSettings());
        operatorMapper.insertOperator(operator);
        relationMapper.batchInsert(req.getId(), req.getCategories());
        return OperatorConverter.INSTANCE.operatorToResponse(operator);
    }

    public OperatorResponse updateOperator(String id, UpdateOperatorRequest req) {
        Operator operator = new Operator();
        operator.setId(id);
        operator.setName(req.getName());
        operator.setDescription(req.getDescription());
        operator.setVersion(req.getVersion());
        operator.setInputs(req.getInputs());
        operator.setOutputs(req.getOutputs());
        operator.setRuntime(req.getRuntime());
        operator.setSettings(req.getSettings());
        operatorMapper.updateOperator(operator);
        relationMapper.batchInsert(id, req.getCategories());
        return getOperatorById(id);
    }

    public OperatorResponse uploadOperator(MultipartFile file, String description) {
        // TODO: 文件上传与解析
        return new OperatorResponse();
    }
}
