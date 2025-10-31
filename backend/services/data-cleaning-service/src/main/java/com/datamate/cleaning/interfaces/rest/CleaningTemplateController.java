package com.datamate.cleaning.interfaces.rest;

import com.datamate.cleaning.application.CleaningTemplateService;
import com.datamate.cleaning.interfaces.dto.CleaningTemplateDto;
import com.datamate.cleaning.interfaces.dto.CreateCleaningTemplateRequest;
import com.datamate.cleaning.interfaces.dto.UpdateCleaningTemplateRequest;
import com.datamate.common.interfaces.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;


@RestController
@RequestMapping("/cleaning/templates")
@RequiredArgsConstructor
public class CleaningTemplateController {
    private final CleaningTemplateService cleaningTemplateService;

    @GetMapping
    public PagedResponse<CleaningTemplateDto> cleaningTemplatesGet(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "keywords", required = false) String keyword) {
        List<CleaningTemplateDto> templates = cleaningTemplateService.getTemplates(keyword);
        if (page == null || size == null) {
            return PagedResponse.of(templates.stream()
                    .sorted(Comparator.comparing(CleaningTemplateDto::getCreatedAt).reversed()).toList());
        }
        int count = templates.size();
        int totalPages = (count + size + 1) / size;
        List<CleaningTemplateDto> limitTemplates = templates.stream()
                .sorted(Comparator.comparing(CleaningTemplateDto::getCreatedAt).reversed())
                .skip((long) page * size)
                .limit(size).toList();
        return PagedResponse.of(limitTemplates, page, count, totalPages);
    }

    @PostMapping
    public CleaningTemplateDto cleaningTemplatesPost(
            @RequestBody CreateCleaningTemplateRequest request) {
        return cleaningTemplateService.createTemplate(request);
    }

    @GetMapping("/{templateId}")
    public CleaningTemplateDto cleaningTemplatesTemplateIdGet(
            @PathVariable("templateId") String templateId) {
        return cleaningTemplateService.getTemplate(templateId);
    }

    @PutMapping("/{templateId}")
    public CleaningTemplateDto cleaningTemplatesTemplateIdPut(
            @PathVariable("templateId") String templateId, @RequestBody UpdateCleaningTemplateRequest request) {
        return cleaningTemplateService.updateTemplate(templateId, request);
    }

    @DeleteMapping("/{templateId}")
    public String cleaningTemplatesTemplateIdDelete(
            @PathVariable("templateId") String templateId) {
        cleaningTemplateService.deleteTemplate(templateId);
        return templateId;
    }
}
