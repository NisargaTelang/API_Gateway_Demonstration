package com.paymentservice.util;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.property.TextAlignment;
import com.paymentservice.dto.OrderResponseDTO;

@Component
public class PdfGenerator {

    @Value("${payment.pdf.storage-path}")
    private String storagePath;

    public String generateInvoice(OrderResponseDTO order, String paymentId) throws Exception {

        File dir = new File(storagePath);
        if (!dir.exists()) dir.mkdirs();

        String fileName = "BILL_" + paymentId + ".pdf";
        String filePath = storagePath + fileName;

        PdfWriter writer = new PdfWriter(filePath);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        document.add(new Paragraph("MyShop Bill")
                .setFontSize(20)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER));

        document.add(new Paragraph("Payment ID: " + paymentId));
        document.add(new Paragraph("Order ID: " + order.getOrderId()));
        document.add(new Paragraph("Customer: " + order.getFullName()));
        document.add(new Paragraph("Email: " + order.getEmail()));
        document.add(new Paragraph("Mobile: " + order.getMobileNo()));
        document.add(new Paragraph("Product: " + order.getProductName()));
        document.add(new Paragraph("Price: ₹" + order.getPriceSnapshot()));
        document.add(new Paragraph("Address: " + order.getAddress()));
        document.add(new Paragraph("Status: PAID"));

        document.close();

        return fileName;   // ✅ return only file name
    }
}

