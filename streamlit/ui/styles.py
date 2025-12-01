GLOBAL_STYLES = """
<style>
    @import url('[https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap](https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap)');

    html, body, [class*="css"] {
        font-family: 'Poppins', sans-serif;
    }

    /* 1. HIDE HEADER */
    header, .stAppHeader { visibility: hidden; height: 0px; }
    .stDeployButton { display: none; }
    #MainMenu { visibility: hidden; }
    footer { visibility: hidden; }
    .block-container { padding-top: 1rem !important; padding-bottom: 5rem !important; }

    /* 2. BACKGROUND */
    .stApp {
        background: linear-gradient(-45deg, #002b49, #004576, #00609c, #e61853);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
    }

    @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    /* 3. GLASS CARD */
    .glass-card {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
        padding: 40px;
        color: white;
        margin-bottom: 30px;
        transition: transform 0.3s ease;
    }

    /* 4. BUTTONS */
    div.stButton > button {
        background: linear-gradient(90deg, #e61853 0%, #ff4b7d 100%);
        color: white;
        border: none;
        border-radius: 16px;
        padding: 18px 36px;
        font-size: 1.1rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 15px rgba(230, 24, 83, 0.3);
        width: 100% !important;
    }

    /* 5. INPUTS */
    .stTextInput > div > div > input {
        color: #ffffff !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .stTextInput > label { color: white !important; }

    /* TYPOGRAPHY */
    h1 { font-size: 3rem !important; font-weight: 700 !important; color: white !important; }
    h2 { color: white !important; }
    p { color: rgba(255, 255, 255, 0.9) !important; }

    @media (max-width: 600px) {
        h1 { font-size: 2.2rem !important; }
        .glass-card { padding: 20px; }
    }
</style>
"""
