import PyPDF2
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer


def read_pdf(file) -> str:
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


def export_course_pdf(course, filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "MainTitle",
        parent=styles["Title"],
        fontSize=24,
        spaceAfter=20,
        alignment=TA_CENTER,
        textColor="#004576",
    )
    h1_style = ParagraphStyle(
        "UnitTitle",
        parent=styles["Heading1"],
        fontSize=18,
        spaceBefore=15,
        spaceAfter=10,
        textColor="#e61853",
    )
    body_style = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontSize=11,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=10,
    )
    obj_style = ParagraphStyle(
        "Obj",
        parent=styles["BodyText"],
        fontSize=10,
        leftIndent=20,
        spaceAfter=5,
    )

    flow = []
    flow.append(Paragraph(course["title"], title_style))
    flow.append(Paragraph(f"Adaptive Level: {course['level']}", styles["Heading2"]))
    flow.append(Paragraph(course["description"], body_style))
    flow.append(PageBreak())

    for i, u in enumerate(course["units"], start=1):
        flow.append(Paragraph(f"Unit {i}: {u['title']}", h1_style))
        flow.append(Paragraph("Objectives:", styles["Heading3"]))
        for o in u["objectives"]:
            flow.append(Paragraph(f"�?� {o}", obj_style))

        flow.append(Spacer(1, 0.5 * cm))
        content_lines = u["content"].split("\n")
        for line in content_lines:
            if line.strip():
                flow.append(Paragraph(line, body_style))

        flow.append(Spacer(1, 0.5 * cm))
        flow.append(Paragraph("Review Quiz", styles["Heading3"]))
        for q in u["quiz_questions"]:
            flow.append(Paragraph(f"Q: {q['question']}", styles["Italic"]))
            flow.append(Spacer(1, 0.1 * cm))

        flow.append(PageBreak())

    doc.build(flow)
