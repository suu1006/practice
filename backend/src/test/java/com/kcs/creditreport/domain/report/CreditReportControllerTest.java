package com.kcs.creditreport.domain.report;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class CreditReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getMyReportsReturnsPagedReports() throws Exception {
        mockMvc.perform(get("/reports")
                        .header(HttpHeaders.AUTHORIZATION, bearerToken())
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(10))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(10))
                .andExpect(jsonPath("$.totalElements").value(15));
    }

    @Test
    void getMyReportsCanSearchFilterAndSort() throws Exception {
        mockMvc.perform(get("/reports")
                        .header(HttpHeaders.AUTHORIZATION, bearerToken())
                        .param("keyword", "카드")
                        .param("creditGrade", "3")
                        .param("sortBy", "creditScore")
                        .param("direction", "asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].title").value("카드 한도 적정성 평가"))
                .andExpect(jsonPath("$.content[0].creditGrade").value(3));
    }

    @Test
    void getMyReportsRejectsInvalidPageParameters() throws Exception {
        String accessToken = bearerToken();

        mockMvc.perform(get("/reports")
                        .header(HttpHeaders.AUTHORIZATION, accessToken)
                        .param("page", "-1")
                        .param("size", "10"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/reports")
                        .header(HttpHeaders.AUTHORIZATION, accessToken)
                        .param("page", "0")
                        .param("size", "0"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/reports")
                        .header(HttpHeaders.AUTHORIZATION, accessToken)
                        .param("page", "0")
                        .param("size", "101"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getMyHistoriesRejectsInvalidPageParameters() throws Exception {
        String accessToken = bearerToken();

        mockMvc.perform(get("/histories")
                        .header(HttpHeaders.AUTHORIZATION, accessToken)
                        .param("page", "-1")
                        .param("size", "10"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/histories")
                        .header(HttpHeaders.AUTHORIZATION, accessToken)
                        .param("page", "0")
                        .param("size", "0"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/histories")
                        .header(HttpHeaders.AUTHORIZATION, accessToken)
                        .param("page", "0")
                        .param("size", "101"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getMyReportDetailRecordsEveryViewHistory() throws Exception {
        String accessToken = bearerToken();

        mockMvc.perform(get("/reports/1").header(HttpHeaders.AUTHORIZATION, accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.maskedResidentRegistrationNumber").value("900101-1******"));

        mockMvc.perform(get("/reports/1").header(HttpHeaders.AUTHORIZATION, accessToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/histories")
                        .header(HttpHeaders.AUTHORIZATION, accessToken)
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].reportId").value(1))
                .andExpect(jsonPath("$.content[1].reportId").value(1));
    }

    private String bearerToken() throws Exception {
        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "test@example.com",
                                  "password": "Password1!"
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode responseBody = objectMapper.readTree(result.getResponse().getContentAsString());
        return "Bearer " + responseBody.get("accessToken").asText();
    }
}
