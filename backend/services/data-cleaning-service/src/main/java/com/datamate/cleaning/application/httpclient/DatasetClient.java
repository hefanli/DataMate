package com.datamate.cleaning.application.httpclient;

import com.datamate.cleaning.domain.model.CreateDatasetRequest;
import com.datamate.cleaning.domain.model.DatasetResponse;
import com.datamate.cleaning.domain.model.PagedDatasetFileResponse;
import com.datamate.common.infrastructure.exception.BusinessException;
import com.datamate.common.infrastructure.exception.ErrorCodeImpl;
import com.datamate.common.infrastructure.exception.SystemErrorCode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.MessageFormat;
import java.time.Duration;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class DatasetClient {
    private static final String BASE_URL = "http://localhost:8080/api";

    private static final String CREATE_DATASET_URL = BASE_URL + "/data-management/datasets";

    private static final String GET_DATASET_URL = BASE_URL + "/data-management/datasets/{0}";

    private static final String GET_DATASET_FILE_URL = BASE_URL + "/data-management/datasets/{0}/files";

    private static final HttpClient CLIENT = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    static {
        OBJECT_MAPPER.registerModule(new JavaTimeModule());
    }

    public static DatasetResponse createDataset(String name, String type) {
        CreateDatasetRequest createDatasetRequest = new CreateDatasetRequest();
        createDatasetRequest.setName(name);
        createDatasetRequest.setDatasetType(type);

        String jsonPayload;
        try {
            jsonPayload = OBJECT_MAPPER.writeValueAsString(createDatasetRequest);
        } catch (IOException e) {
            log.error("Error occurred while converting the object.", e);
            throw BusinessException.of(SystemErrorCode.UNKNOWN_ERROR);
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(CREATE_DATASET_URL))
                .timeout(Duration.ofSeconds(30))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        return sendAndReturn(request, DatasetResponse.class);
    }

    public static DatasetResponse getDataset(String datasetId) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(MessageFormat.format(GET_DATASET_URL, datasetId)))
                .timeout(Duration.ofSeconds(30))
                .header("Content-Type", "application/json")
                .GET()
                .build();

        return sendAndReturn(request, DatasetResponse.class);
    }

    public static PagedDatasetFileResponse getDatasetFile(String datasetId, PageRequest page) {
        String url = buildQueryParams(MessageFormat.format(GET_DATASET_FILE_URL, datasetId),
                Map.of("page", page.getPageNumber(), "size", page.getPageSize()));
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(30))
                .header("Content-Type", "application/json")
                .GET()
                .build();

        return sendAndReturn(request, PagedDatasetFileResponse.class);
    }

    private static <T> T sendAndReturn(HttpRequest request, Class<T> clazz) {
        try {
            HttpResponse<String> response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
            int statusCode = response.statusCode();
            String responseBody = response.body();
            JsonNode jsonNode = OBJECT_MAPPER.readTree(responseBody);

            if (statusCode < 200 || statusCode >= 300) {
                String code = jsonNode.get("code").asText();
                String message = jsonNode.get("message").asText();
                throw BusinessException.of(ErrorCodeImpl.of(code, message));
            }
            return OBJECT_MAPPER.treeToValue(jsonNode.get("data"), clazz);
        } catch (IOException | InterruptedException e) {
            log.error("Error occurred while making the request.", e);
            throw BusinessException.of(SystemErrorCode.UNKNOWN_ERROR);
        }
    }

    private static String buildQueryParams(String baseUrl, Map<String, Object> params) {
        if (params == null || params.isEmpty()) {
            return baseUrl;
        }

        String queryString = params.entrySet().stream()
                .map(entry -> entry.getKey() + entry.getValue().toString())
                .collect(Collectors.joining("&"));

        return baseUrl + (baseUrl.contains("?") ? "&" : "?") + queryString;
    }
}
