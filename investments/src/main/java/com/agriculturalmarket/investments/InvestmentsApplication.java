package com.agriculturalmarket.investments;

import com.agriculturalmarket.investments.dto.InvestmentsContactInfoDto;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableFeignClients
@EnableScheduling
@EnableConfigurationProperties(value = {InvestmentsContactInfoDto.class})
public class InvestmentsApplication {

	public static void main(String[] args) {
		SpringApplication.run(InvestmentsApplication.class, args);
	}

}
