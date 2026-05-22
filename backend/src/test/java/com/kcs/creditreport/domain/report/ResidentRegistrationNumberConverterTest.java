package com.kcs.creditreport.domain.report;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ResidentRegistrationNumberConverterTest {

    private final ResidentRegistrationNumberConverter converter = new ResidentRegistrationNumberConverter();

    @Test
    void encryptsAndDecryptsResidentRegistrationNumber() {
        String residentRegistrationNumber = "900101-1234567";

        String encrypted = converter.convertToDatabaseColumn(residentRegistrationNumber);
        String decrypted = converter.convertToEntityAttribute(encrypted);

        assertThat(encrypted).isNotEqualTo(residentRegistrationNumber);
        assertThat(decrypted).isEqualTo(residentRegistrationNumber);
    }
}
