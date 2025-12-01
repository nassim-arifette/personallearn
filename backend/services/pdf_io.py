from io import BytesIO

import PyPDF2
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer


def read_pdf(file) -> str:
    """Extract text from a PDF-like file object."""
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


def _build_document(target):
    return SimpleDocTemplate(
        target,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )


def _build_flow(course):
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
    flow.append(Paragraph(course.get("description", ""), body_style))
    flow.append(PageBreak())

    for idx, unit in enumerate(course.get("units", []), start=1):
        flow.append(Paragraph(f"Unit {idx}: {unit.get('title', '')}", h1_style))
        flow.append(Paragraph("Objectives:", styles["Heading3"]))
        for obj in unit.get("objectives", []):
            flow.append(Paragraph(f"- {obj}", obj_style))

        flow.append(Spacer(1, 0.5 * cm))
        content_lines = unit.get("content", "").split("\n")
        for line in content_lines:
            if line.strip():
                flow.append(Paragraph(line, body_style))

        flow.append(Spacer(1, 0.5 * cm))
        flow.append(Paragraph("Review Quiz", styles["Heading3"]))
        for q in unit.get("quiz_questions", []):
            flow.append(Paragraph(f"Q: {q.get('question', '')}", styles["Italic"]))
            flow.append(Spacer(1, 0.1 * cm))

        flow.append(PageBreak())
    return flow


def export_course_pdf(course, filename):
    """Export a course dict to a PDF file on disk."""
    doc = _build_document(filename)
    doc.build(_build_flow(course))
    return filename


def render_course_pdf_to_bytes(course) -> bytes:
    """Render a course PDF and return the raw bytes (for API responses)."""
    buffer = BytesIO()
    doc = _build_document(buffer)
    doc.build(_build_flow(course))
    buffer.seek(0)
    return buffer.read()
