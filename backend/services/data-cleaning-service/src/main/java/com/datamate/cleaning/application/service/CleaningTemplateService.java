package com.datamate.cleaning.application.service;


import com.datamate.cleaning.domain.converter.OperatorInstanceConverter;
import com.datamate.cleaning.domain.model.OperatorInstancePo;
import com.datamate.cleaning.domain.model.TemplateWithInstance;
import com.datamate.cleaning.infrastructure.persistence.mapper.CleaningTemplateMapper;
import com.datamate.cleaning.infrastructure.persistence.mapper.OperatorInstanceMapper;
import com.datamate.cleaning.interfaces.dto.CleaningTemplate;
import com.datamate.cleaning.interfaces.dto.CreateCleaningTemplateRequest;
import com.datamate.cleaning.interfaces.dto.OperatorResponse;
import com.datamate.cleaning.interfaces.dto.UpdateCleaningTemplateRequest;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CleaningTemplateService {
    private final CleaningTemplateMapper cleaningTemplateMapper;

    private final OperatorInstanceMapper operatorInstanceMapper;

    public List<CleaningTemplate> getTemplates(String keywords) {
        List<OperatorResponse> allOperators = cleaningTemplateMapper.findAllOperators();
        Map<String, OperatorResponse> operatorsMap = allOperators.stream()
                .collect(Collectors.toMap(OperatorResponse::getId, Function.identity()));
        List<TemplateWithInstance> allTemplates = cleaningTemplateMapper.findAllTemplates(keywords);
        Map<String, List<TemplateWithInstance>> templatesMap = allTemplates.stream()
                .collect(Collectors.groupingBy(TemplateWithInstance::getId));
        return templatesMap.entrySet().stream().map(twi -> {
            List<TemplateWithInstance> value = twi.getValue();
            CleaningTemplate template = new CleaningTemplate();
            template.setId(twi.getKey());
            template.setName(value.get(0).getName());
            template.setDescription(value.get(0).getDescription());
            template.setInstance(value.stream().filter(v -> StringUtils.isNotBlank(v.getOperatorId()))
                    .sorted(Comparator.comparingInt(TemplateWithInstance::getOpIndex))
                    .map(v -> {
                        OperatorResponse operator = operatorsMap.get(v.getOperatorId());
                        if (StringUtils.isNotBlank(v.getSettingsOverride())) {
                            operator.setSettings(v.getSettingsOverride());
                        }
                        return operator;
                    }).toList());
            template.setCreatedAt(value.get(0).getCreatedAt());
            template.setUpdatedAt(value.get(0).getUpdatedAt());
            return template;
        }).toList();
    }

    @Transactional
    public CleaningTemplate createTemplate(CreateCleaningTemplateRequest request) {
        CleaningTemplate template = new CleaningTemplate();
        String templateId = UUID.randomUUID().toString();
        template.setId(templateId);
        template.setName(request.getName());
        template.setDescription(request.getDescription());
        cleaningTemplateMapper.insertTemplate(template);

        List<OperatorInstancePo> instancePos = request.getInstance().stream()
                .map(OperatorInstanceConverter.INSTANCE::operatorToDo).toList();
        operatorInstanceMapper.insertInstance(templateId, instancePos);
        return template;
    }

    public CleaningTemplate getTemplate(String templateId) {
        return cleaningTemplateMapper.findTemplateById(templateId);
    }

    @Transactional
    public CleaningTemplate updateTemplate(String templateId, UpdateCleaningTemplateRequest request) {
        CleaningTemplate template = cleaningTemplateMapper.findTemplateById(templateId);
        if (template != null) {
            template.setName(request.getName());
            template.setDescription(request.getDescription());
            cleaningTemplateMapper.updateTemplate(template);
        }
        return template;
    }

    @Transactional
    public void deleteTemplate(String templateId) {
        cleaningTemplateMapper.deleteTemplate(templateId);
        operatorInstanceMapper.deleteByInstanceId(templateId);
    }
}
