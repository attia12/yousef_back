package com.example.Task_Management.services;

import com.example.Task_Management.entities.Project;
import com.example.Task_Management.entities.Task;
import com.example.Task_Management.repositories.ProjectRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service


public class PdfGenerationService {

    public ByteArrayInputStream generateProjectPdf(Project project) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.FontFamily.TIMES_ROMAN, 18, Font.BOLD);
            Font headerFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.BOLD);
            Font bodyFont = new Font(Font.FontFamily.TIMES_ROMAN, 12);

            // Title
            Paragraph title = new Paragraph("Project Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("Project: " + project.getTitle(), headerFont));
            document.add(new Paragraph("Employee: " + project.getUser().getName(), bodyFont));
            document.add(new Paragraph("Due Date: " + project.getDueDate(), bodyFont));
            document.add(new Paragraph("Priority: " + project.getPriority(), bodyFont));
            document.add(new Paragraph("Project Status: " + project.getProjectStatus(), bodyFont));
            document.add(new Paragraph("\n"));

            // Task Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            // Set column headers
            PdfPCell c1 = new PdfPCell(new Phrase("Task Title", headerFont));
            c1.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(c1);

            PdfPCell c2 = new PdfPCell(new Phrase("Task Type", headerFont));
            c2.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(c2);

            PdfPCell c3 = new PdfPCell(new Phrase("Due Date", headerFont));
            c3.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(c3);

            PdfPCell c4 = new PdfPCell(new Phrase("Description", headerFont));
            c4.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(c4);

            table.setHeaderRows(1);

            // Add tasks
            List<Task> tasks = project.getTasks();
            for (Task task : tasks) {
                table.addCell(new Phrase(task.getTitle(), bodyFont));
                table.addCell(new Phrase(task.getType(), bodyFont));
                String dueDate = task.getDueDate() != null ? task.getDueDate().toString() : "N/A";
                table.addCell(new Phrase(dueDate, bodyFont));
                //table.addCell(new Phrase(task.getDueDate().toString(), bodyFont));
                table.addCell(new Phrase(task.getDescription(), bodyFont));
            }

            document.add(table);
            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
