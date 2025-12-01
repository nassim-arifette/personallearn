import io
import time

import streamlit as st

from data import QUESTIONS
from services.course_generator import generate_course_from_pdf
from services.pdf_io import export_course_pdf, read_pdf
from ui.styles import GLOBAL_STYLES


def init_state():
    if "step" not in st.session_state:
        st.session_state["step"] = 0
    if "courses" not in st.session_state:
        st.session_state["courses"] = []
    if "quiz_index" not in st.session_state:
        st.session_state["quiz_index"] = 0
    if "quiz_score" not in st.session_state:
        st.session_state["quiz_score"] = 0
    if "quiz_start_time" not in st.session_state:
        st.session_state["quiz_start_time"] = 0
    if "computed_profile" not in st.session_state:
        st.session_state["computed_profile"] = {}


def render_landing(container):
    with container:
        st.markdown("<div style='height: 2vh;'></div>", unsafe_allow_html=True)
        col_txt, col_empty = st.columns([1.6, 1])

        with col_txt:
            st.markdown(
                """
            <h1>Unlock Your<br><span style="color: #e61853;">Learning Potential</span></h1>
            <p style="font-size: 1.2rem; margin-bottom: 30px;">The adaptive AI platform that molds content to your unique cognitive rhythm.</p>
            """,
                unsafe_allow_html=True,
            )

            if st.button("Start Cognitive Calibration", use_container_width=True):
                st.session_state["step"] = 1
                st.session_state["quiz_start_time"] = time.time()
                st.rerun()

            st.markdown(
                """
            <div style="margin-top: 30px; opacity: 0.9;">
                <p style="font-size: 1rem !important; line-height: 1.6;">
                    <strong>PersonalLearn</strong> solves the "one-size-fits-all" crisis in education. 
                    Using <span style="color:#ff9fb8; font-weight:bold;">PISA-derived cognitive metrics</span>, 
                    we analyze your focus capacity and logic patterns to restructure dense PDF materials into 
                    perfectly sized <em>micro-units</em>. This ensures mastery, prevents burnout, and optimizes retention.
                </p>
            </div>
            """,
                unsafe_allow_html=True,
            )

            st.markdown(
                """
            <div style='margin-top: 20px; display: flex; gap: 15px;'>
                <div class='glass-card' style='padding: 15px; text-align: center; flex: 1; margin-bottom: 0px;'>
                    <h3 style='margin:0; color:#ff9fb8;'>Focus</h3>
                    <p style='font-size: 0.8rem !important; margin:0;'>Attention Analysis</p>
                </div>
                <div class='glass-card' style='padding: 15px; text-align: center; flex: 1; margin-bottom: 0px;'>
                    <h3 style='margin:0; color:#ff9fb8;'>Adapt</h3>
                    <p style='font-size: 0.8rem !important; margin:0;'>Dynamic Content</p>
                </div>
            </div>
            """,
                unsafe_allow_html=True,
            )


def render_quiz(container):
    q_idx = st.session_state["quiz_index"]

    with container:
        st.markdown("<div style='height: 5vh;'></div>", unsafe_allow_html=True)

        if q_idx < len(QUESTIONS):
            q = QUESTIONS[q_idx]
            st.markdown(
                f"""
            <div class="glass-card">
                <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem !important; margin-bottom: 10px; color: #e61853 !important;">Calibration Task {q_idx + 1}/3</p>
                <h2>{q['q']}</h2>
            </div>
            """,
                unsafe_allow_html=True,
            )

            for i, opt in enumerate(q["options"]):
                if st.button(opt, key=f"opt_{i}", use_container_width=True):
                    if opt == q["correct"]:
                        st.session_state["quiz_score"] += 1
                    st.session_state["quiz_index"] += 1
                    st.rerun()
        else:
            duration = time.time() - st.session_state["quiz_start_time"]
            efficiency = (st.session_state["quiz_score"] / (duration + 1)) * 100

            if efficiency > 12:
                profile = {"level": "Advanced", "units": 4, "desc": "High Density"}
            elif efficiency > 6:
                profile = {"level": "Intermediate", "units": 7, "desc": "Balanced"}
            else:
                profile = {"level": "Beginner", "units": 10, "desc": "Micro-Learning"}

            st.session_state["computed_profile"] = profile
            st.session_state["step"] = 2
            st.rerun()


def render_profile_and_upload(container):
    profile = st.session_state["computed_profile"]

    with container:
        st.markdown("<div style='height: 5vh;'></div>", unsafe_allow_html=True)

        c1, c2, c3 = st.columns(3)
        with c1:
            st.markdown(
                f"<div class='glass-card' style='text-align:center; padding: 20px;'><h3>{profile['desc']}</h3><p>Profile</p></div>",
                unsafe_allow_html=True,
            )
        with c2:
            st.markdown(
                f"<div class='glass-card' style='text-align:center; padding: 20px;'><h3>{profile['units']} Units</h3><p>Segmentation</p></div>",
                unsafe_allow_html=True,
            )
        with c3:
            st.markdown(
                f"<div class='glass-card' style='text-align:center; padding: 20px;'><h3>{profile['level']}</h3><p>Complexity</p></div>",
                unsafe_allow_html=True,
            )

        st.markdown(
            f"""
        <div class="glass-card">
            <h2>Upload Material</h2>
            <p>We will restructure your document into <b>{profile['units']} {profile['level']}</b> units.</p>
        </div>
        """,
            unsafe_allow_html=True,
        )

        uploaded_file = st.file_uploader("Select PDF", type="pdf")
        course_title = st.text_input("Course Title", "My Adaptive Course")

        if uploaded_file and st.button("Generate Adapted Course", use_container_width=True):
            with st.spinner("Re-engineering content structure..."):
                pdf_text = read_pdf(io.BytesIO(uploaded_file.read()))
                course = generate_course_from_pdf(
                    pdf_text, course_title, profile["level"], profile["units"]
                )
                st.session_state["courses"] = [course]
                st.session_state["step"] = 3
                st.rerun()


def render_results(container):
    course = st.session_state["courses"][0]

    with container:
        st.markdown(
            f"""
        <div class="glass-card">
            <h1 style="font-size: 2.5rem !important;">{course['title']}</h1>
            <p>{course['description']}</p>
        </div>
        """,
            unsafe_allow_html=True,
        )

        fname = f"{course['title'].replace(' ', '_')}.pdf"
        export_course_pdf(course, fname)

        with open(fname, "rb") as f:
            st.download_button(
                "Download Full PDF Course",
                f,
                file_name=fname,
                mime="application/pdf",
                use_container_width=True,
            )

        if st.button("Start New Session", use_container_width=True):
            st.session_state["step"] = 0
            st.rerun()

        st.markdown("<br>", unsafe_allow_html=True)
        for unit in course["units"]:
            st.markdown(
                f"""
            <div class="glass-card" style="padding: 30px;">
                <h3 style="color: #e61853 !important;">{unit['title']}</h3>
                <p style="opacity: 0.8; margin-bottom: 20px;">{unit['content'][:350]}...</p>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; display: inline-block;">
                    <span style="font-size: 0.9rem;">�YZ� Objective: {unit['objectives'][0]}</span>
                </div>
            </div>
            """,
                unsafe_allow_html=True,
            )


def main():
    st.set_page_config(page_title="PersonalLearn", page_icon="�Y��", layout="wide")
    init_state()

    st.markdown(GLOBAL_STYLES, unsafe_allow_html=True)
    container = st.container()

    if st.session_state["step"] == 0:
        render_landing(container)
    elif st.session_state["step"] == 1:
        render_quiz(container)
    elif st.session_state["step"] == 2:
        render_profile_and_upload(container)
    elif st.session_state["step"] == 3:
        render_results(container)


if __name__ == "__main__":
    main()
