package com.paymentservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Folder where your bills are stored
        String billDirectory = "file:///D:/gateway-files/bills/";

        registry.addResourceHandler("/bills/**")
                .addResourceLocations(billDirectory)
                .setCachePeriod(0);
    }
}
