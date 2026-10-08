import sys
import os

try:
    import pptx
except ImportError:
    os.system(f"{sys.executable} -m pip install python-pptx")
    import pptx

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette
    COLOR_BG = RGBColor(248, 250, 252)       # Light Slate
    COLOR_PRIMARY = RGBColor(15, 23, 42)     # Deep Navy #0f172a
    COLOR_ACCENT = RGBColor(14, 116, 144)    # Cyan / Medical Blue #0e7490
    COLOR_TEXT_DARK = RGBColor(30, 41, 59)   # Dark Gray #1e293b
    COLOR_CARD_BG = RGBColor(255, 255, 255)  # White Card
    COLOR_BORDER = RGBColor(226, 232, 240)   # Border Light Gray

    img_usecase = r"C:\Users\izhan\.gemini\antigravity\brain\e982fb4d-e1cd-408b-b901-d0e97de9398d\.user_uploaded\media_1791330579329.png"
    img_sysarch = r"C:\Users\izhan\.gemini\antigravity\brain\e982fb4d-e1cd-408b-b901-d0e97de9398d\.user_uploaded\media_1791330617386.jpg"

    blank_slide_layout = prs.slide_layouts[6]

    def add_header(slide, title_text, category_text="REVIEW-2 PRESENTATION"):
        # Header Container
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(1.0))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p_cat = tf.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_ACCENT
        p_cat.font.name = "Calibri"
        
        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_PRIMARY
        p_title.font.name = "Calibri"

    def add_card(slide, left, top, width, height):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = COLOR_CARD_BG
        shape.line.color.rgb = COLOR_BORDER
        shape.line.width = Pt(1)
        return shape

    # SLIDE 1: Title Slide
    s1 = prs.slides.add_slide(blank_slide_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_PRIMARY
    bg1.line.fill.background()

    tb1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.333), Inches(4.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "SWE3004 - SOFTWARE DESIGN & DEVELOPMENT PROJECT (REVIEW-2)"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_ACCENT

    p = tf1.add_paragraph()
    p.text = "Automated Lung Cancer Subtype Classification from CT Images using Deep CNNs and Attention Mechanisms"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)
    p.space_after = Pt(20)

    p = tf1.add_paragraph()
    p.text = "Student Name: Mohammed Izhan I  |  Register No: 22MIS0336"
    p.font.size = Pt(16)
    p.font.color.rgb = RGBColor(203, 213, 225)

    p = tf1.add_paragraph()
    p.text = "Under the Guidance of: Prof. AAMEER ARSHATH A (Assistant Professor)"
    p.font.size = Pt(15)
    p.font.color.rgb = RGBColor(203, 213, 225)

    p = tf1.add_paragraph()
    p.text = "Department of Software and Systems Engineering, SCORE, VIT Chennai"
    p.font.size = Pt(14)
    p.font.color.rgb = COLOR_ACCENT

    # Helper function for standard bullet list slides
    def create_bullet_slide(title, category, bullets):
        s = prs.slides.add_slide(blank_slide_layout)
        add_header(s, title, category)
        
        card = add_card(s, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.3))
        tb = s.shapes.add_textbox(Inches(1.1), Inches(1.7), Inches(11.133), Inches(4.9))
        tf = tb.text_frame
        tf.word_wrap = True
        
        for i, b in enumerate(bullets):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.text = b[0]
            p.font.size = Pt(18)
            p.font.bold = True
            p.font.color.rgb = COLOR_PRIMARY
            p.space_before = Pt(10)
            
            if len(b) > 1:
                p2 = tf.add_paragraph()
                p2.text = b[1]
                p2.font.size = Pt(15)
                p2.font.color.rgb = COLOR_TEXT_DARK
                p2.level = 1
        return s

    # SLIDE 2: Executive Summary
    create_bullet_slide(
        "Executive Summary & Project Overview",
        "Executive Abstract",
        [
            ("Clinical Need in Thoracic Oncology", "Lung cancer is a leading cause of global cancer mortality. Accurate differentiation between Adenocarcinoma (ADC), Squamous Cell Carcinoma (SCC), and Small Cell Lung Carcinoma (SCLC) is crucial for therapy."),
            ("Deep Learning & Attention Novelty", "Augmenting baseline ResNet-18 with Convolutional Block Attention Modules (CBAM) enables the model to selectively refine spatial nodule boundaries and diagnostic feature channels."),
            ("Explainable AI (XAI) & Full-Stack Platform", "Integrates Grad-CAM visual heatmaps for diagnostic transparency, wrapped inside a medical-grade web app (React frontend + FastAPI backend + Gemini AI Copilot)."),
            ("Key Performance Metrics Achieved", "Achieved 94.80% validation accuracy (+6.3% over baseline), sub-350ms total execution latency, and 100% PyTest backend pass rate.")
        ]
    )

    # SLIDE 3: Introduction & Motivation
    create_bullet_slide(
        "Introduction & Clinical Motivation",
        "Context & Justification",
        [
            ("Computed Tomography (CT) Standardization", "CT imaging is the primary non-invasive modality for assessing pulmonary nodules and suspicious tumor mass structures."),
            ("Histological Subtype Impact on Treatment", "NSCLC (ADC, SCC) and SCLC demand vastly different chemotherapeutic regimens, surgical interventions, and prognostic tracking."),
            ("Diagnostic Inter-Observer Variability", "Manual interpretation of large 3D CT volumes is time-consuming and subject to inter-observer variability among radiologists."),
            ("Goal of AI Assistive Decision Support", "Empower clinicians with rapid, interpretable AI predictions that validate lesion margins without replacing expert clinical judgment.")
        ]
    )

    # SLIDE 4: Problem Statement
    create_bullet_slide(
        "Problem Statement & Clinical Challenges",
        "Research Problem",
        [
            ("Subtle Inter-Class Morphological Similarity", "Adenocarcinoma and Squamous Cell Carcinoma exhibit high visual similarity on CT slices, leading to potential misclassification in early stages."),
            ("The 'Black-Box' Obstacle in Medical AI", "Standard deep CNNs produce probability numbers without explaining the anatomical basis, causing low clinician trust."),
            ("Absence of Integrated Web Systems", "Most research models exist strictly as offline Python scripts, lacking DICOM loading, patient record management, or web-based PACS viewports.")
        ]
    )

    # SLIDE 5: Objectives
    create_bullet_slide(
        "Project Objectives & Key Scope",
        "Project Goals",
        [
            ("1. Multi-Class Attention CNN Development", "Train ResNet-18 + CBAM architecture for 3-class lung cancer subtype identification."),
            ("2. DICOM Hounsfield Unit Preprocessing Engine", "Build automated rescaling pipeline (Level = -600 HU, Width = 1500 HU) to normalize raw CT scans."),
            ("3. Visual Explainability via Grad-CAM", "Compute layer 4 spatial activations to output colormap heatmaps highlighting nodule regions of interest."),
            ("4. Full-Stack Dual-Cloud Deployment", "Build FastAPI backend on Render, React UI on Vercel, and integrate Google Gemini 1.5 Flash AI Assistant.")
        ]
    )

    # SLIDE 6: System Scope
    create_bullet_slide(
        "System Scope (Functional & Quality Boundaries)",
        "System Scope",
        [
            ("Target Subtypes Covered", "Adenocarcinoma (ADC), Squamous Cell Carcinoma (SCC), Small Cell Lung Carcinoma (SCLC)."),
            ("Input & Output Boundaries", "Accepts DICOM (.dcm) and PNG/JPG CT images; outputs class probability breakdown, confidence score, and Grad-CAM overlay."),
            ("Performance & Latency Limits", "End-to-end slice inference latency strictly bound under 500ms (achieved ~320ms in production)."),
            ("Security & Data Integrity", "Enforces JWT bearer token authorization, bcrypt password hashing, CORS middleware, and SQLite relational storage.")
        ]
    )

    # SLIDE 7: Literature Survey Table
    s7 = prs.slides.add_slide(blank_slide_layout)
    add_header(s7, "Literature Survey & Comparative Analysis", "Literature Review")
    card7 = add_card(s7, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.3))
    
    rows, cols = 6, 5
    table_shape = s7.shapes.add_table(rows, cols, Inches(1.0), Inches(1.7), Inches(11.333), Inches(4.8))
    table = table_shape.table
    
    headers = ["Paper & Author", "Model Architecture", "Focus Area", "Accuracy", "Gaps Addressed"]
    data = [
        ["Haque et al. (2025)", "Concatenated CNN + Attention", "XAI & Subtyping", "93.10%", "High computational complexity"],
        ["Özdemir et al. (2025)", "InceptionNeXt Hybrid", "Detection & Features", "92.40%", "No web platform integration"],
        ["Zhu et al. (2024)", "Synthetic Pathological Priors", "CT Subtyping", "91.80%", "Complex multi-stage pipeline"],
        ["Ardila et al. (2019)", "3D Deep CNN (Nature Med)", "Screening & Nodule Det.", "94.40%", "High VRAM demand, no subtyping"],
        ["Proposed Work (2026)", "ResNet-18 + CBAM + Grad-CAM", "Subtyping, XAI & Web App", "94.80%", "Sub-350ms, deployed on Vercel/Render"]
    ]
    
    for c, h in enumerate(headers):
        cell = table.cell(0, c)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_PRIMARY
        for p in cell.text_frame.paragraphs:
            p.font.size = Pt(13)
            p.font.bold = True
            p.font.color.rgb = RGBColor(255, 255, 255)
            
    for r, row_data in enumerate(data):
        for c, val in enumerate(row_data):
            cell = table.cell(r + 1, c)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = COLOR_CARD_BG if r % 2 == 0 else RGBColor(241, 245, 249)
            for p in cell.text_frame.paragraphs:
                p.font.size = Pt(12)
                p.font.color.rgb = COLOR_PRIMARY if r == 4 else COLOR_TEXT_DARK
                if r == 4:
                    p.font.bold = True

    # SLIDE 8: Methodology Pipeline
    create_bullet_slide(
        "Overall System Methodology & Data Flow",
        "Methodology",
        [
            ("Phase 1: DICOM Processing & Windowing", "Rescaling raw 16-bit CT pixel values to Hounsfield Units [-1350, +150 HU] and normalizing to Float32 arrays [0.0, 1.0]."),
            ("Phase 2: Attention Feature Extraction", "Passing (1, 3, 224, 224) tensors through ResNet-18 backbone with CBAM Channel & Spatial attention blocks at Layers 3 & 4."),
            ("Phase 3: Softmax Subtype Classification", "Global average pooling and fully connected layer mapping to ADC, SCC, and SCLC probability distributions."),
            ("Phase 4: XAI Heatmap & Web Presentation", "Grad-CAM backward pass on layer4.1.conv2 to generate JET colormap overlay delivered via FastAPI REST endpoint to React UI.")
        ]
    )

    # SLIDE 9: Dataset Preprocessing
    create_bullet_slide(
        "Dataset Description & DICOM HU Preprocessing",
        "Preprocessing",
        [
            ("TCIA Lung-PET-CT-Dx Dataset Cohort", "Utilized 355 pathologically confirmed subjects: Adenocarcinoma (251), Squamous Cell Carcinoma (61), Small Cell Lung Carcinoma (38), Large Cell Carcinoma (5)."),
            ("Hounsfield Unit (HU) Transformation Math", "HU = Pixel Value * Rescale Slope + Rescale Intercept. Standard lung windowing applies Level = -600 HU and Width = 1500 HU."),
            ("Data Augmentation & Normalization", "Resized to 224x224, applied 3-channel grayscale expansion, random rotations (+/- 15 deg), horizontal flipping, and intensity clipping.")
        ]
    )

    # SLIDE 10: Deep CNN Architecture with CBAM
    create_bullet_slide(
        "Deep CNN Architecture with CBAM Attention",
        "Deep Learning Core",
        [
            ("ResNet-18 Backbone", "Serves as feature extractor learning low-level edge primitives and high-level semantic tumor textures."),
            ("Channel Attention Sub-Module (Mc)", "Employs AvgPool and MaxPool across spatial dimensions followed by shared MLP to highlight 'WHAT' feature channels carry tumor signals."),
            ("Spatial Attention Sub-Module (Ms)", "Applies 7x7 convolution across channel-pooled feature maps to identify 'WHERE' lesion boundaries are located."),
            ("Sequential CBAM Integration", "F' = Mc(F) (*) F ; F'' = Ms(F') (*) F'. Refined feature maps are passed to multi-class Softmax classifier.")
        ]
    )

    # SLIDE 11: Explainable AI Engine
    create_bullet_slide(
        "Explainable AI (XAI) Engine via Grad-CAM",
        "Explainability",
        [
            ("Grad-CAM Activation Weight Calculation", "Computes gradients of target predicted class score y^c with respect to feature maps A^k of target layer (layer4.1.conv2)."),
            ("Heatmap Generation Formulation", "L_Grad-CAM = ReLU( sum( alpha_k^c * A^k ) ). ReLU filters out negative non-contributing features."),
            ("Visual Overlay Synthesis", "Resizes heatmaps to 224x224, applies JET colormap, masks outer 20px edge artifacts, and blends over original CT scan (alpha = 0.55)."),
            ("Radiological Value", "Ensures clinicians can verify if the AI focuses on true nodule tissue rather than background thoracic structures.")
        ]
    )

    # SLIDE 12: UML Use Case Diagram (with Image)
    s12 = prs.slides.add_slide(blank_slide_layout)
    add_header(s12, "UML Use Case Diagram", "System Design")
    card12 = add_card(s12, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.3))
    if os.path.exists(img_usecase):
        s12.shapes.add_picture(img_usecase, Inches(2.2), Inches(1.7), height=Inches(4.9))

    # SLIDE 13: UML Class Diagram
    create_bullet_slide(
        "UML Class Diagram & Object-Oriented Architecture",
        "Class Architecture",
        [
            ("DICOMService Module", "Handles DICOM loading, HU transformation, synthetic CT generation, and intensity clipping."),
            ("AttentionCNN & CBAM Classes", "Encapsulates ChannelAttention, SpatialAttention, CBAMModule, and ResNet-18 backbone."),
            ("AIService Singleton Controller", "Thread-safe singleton class maintaining PyTorch model instance, CUDA/CPU device, and Grad-CAM hooks."),
            ("FastAPI & React Integration", "FastAPIApp routing controllers invoke AIService and GeminiChatService to deliver JSON responses to React UI.")
        ]
    )

    # SLIDE 14: System Architecture Diagram (with Image)
    s14 = prs.slides.add_slide(blank_slide_layout)
    add_header(s14, "4-Layer System Architecture Diagram", "System Architecture")
    card14 = add_card(s14, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.3))
    if os.path.exists(img_sysarch):
        s14.shapes.add_picture(img_sysarch, Inches(1.5), Inches(1.7), height=Inches(4.9))

    # SLIDE 15: Experimental Performance Metrics Table
    s15 = prs.slides.add_slide(blank_slide_layout)
    add_header(s15, "Experimental Validation & Model Performance", "Evaluation")
    card15 = add_card(s15, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.3))
    
    t_shape15 = s15.shapes.add_table(5, 6, Inches(1.0), Inches(1.8), Inches(11.333), Inches(4.5))
    t15 = t_shape15.table
    
    h15 = ["Model Variant", "Accuracy", "Precision", "Recall", "F1-Score", "Inference Latency"]
    d15 = [
        ["Baseline ResNet-18", "88.50%", "87.90%", "88.10%", "88.00%", "180 ms"],
        ["ResNet-18 + Channel Attn.", "91.20%", "90.80%", "91.00%", "90.90%", "240 ms"],
        ["ResNet-18 + Spatial Attn.", "90.60%", "90.10%", "90.40%", "90.25%", "230 ms"],
        ["ResNet-18 + CBAM (Proposed)", "94.80%", "94.20%", "94.50%", "94.34%", "320 ms"]
    ]
    
    for c, h in enumerate(h15):
        cell = t15.cell(0, c)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_PRIMARY
        for p in cell.text_frame.paragraphs:
            p.font.size = Pt(13)
            p.font.bold = True
            p.font.color.rgb = RGBColor(255, 255, 255)
            
    for r, row_data in enumerate(d15):
        for c, val in enumerate(row_data):
            cell = t15.cell(r + 1, c)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = COLOR_CARD_BG if r % 2 == 0 else RGBColor(241, 245, 249)
            for p in cell.text_frame.paragraphs:
                p.font.size = Pt(12)
                p.font.color.rgb = COLOR_PRIMARY if r == 3 else COLOR_TEXT_DARK
                if r == 3:
                    p.font.bold = True

    # SLIDE 16: Software & Hardware Specs
    create_bullet_slide(
        "Software & Hardware Specifications",
        "Tech Stack",
        [
            ("Deep Learning & Vision Stack", "Python 3.12, PyTorch 2.2, TorchVision, OpenCV (cv2), PyDICOM, NumPy, Pandas."),
            ("Backend API & Cloud Hosting", "FastAPI (ASGI), Uvicorn, Pydantic schemas, SQLAlchemy ORM, SQLite database, Render Cloud."),
            ("Frontend Workstation UI Stack", "React 18, TypeScript, Vite, Tailwind CSS, Recharts SVG graphics, Vercel Edge Network."),
            ("Generative AI & Development IDE", "Google Gemini 1.5 Flash API (Clinical Copilot), VS Code, Antigravity IDE, PyTest suite.")
        ]
    )

    # SLIDE 17: Implementation Snippets
    create_bullet_slide(
        "Implementation Details & Core Code Structure",
        "Implementation",
        [
            ("AI Inference Engine (ai_service.py)", "Executes PyTorch forward pass, computes Softmax probabilities, and maps argmax class indices."),
            ("Grad-CAM Hook Handler (gradcam.py)", "Registers forward and backward gradient hooks on target activation layer layer4.1.conv2."),
            ("Gemini Clinical Chatbot Route (chat.py)", "Asynchronous REST route querying Gemini 1.5 Flash with clinical prompt context and local fallback rule engine."),
            ("React PACS Viewport (GradCamViewer.tsx)", "Renders interactive original CT vs Grad-CAM heatmap overlay with opacity sliders (10%-100%) and zoom controls.")
        ]
    )

    # SLIDE 18: Testing Strategies
    create_bullet_slide(
        "Testing Strategies & Verification Suite",
        "Quality Assurance",
        [
            ("Automated PyTest Test Suite", "All 18 automated backend unit and integration test cases passed cleanly with zero errors."),
            ("Unit Testing Scope", "Verified DICOM HU intensity rescaling, PyTorch tensor output shapes (1, 3, 224, 224), and JWT bcrypt token hashing."),
            ("Integration & Endpoint Testing", "Tested REST endpoints (/predictions, /patients, /reports, /chat) using Starlette TestClient."),
            ("Security & Build Verification", "Confirmed CORS origin rules, HTTP 401 unauthorized protection, and clean production Vite frontend compilation.")
        ]
    )

    # SLIDE 19: System Deliverables
    create_bullet_slide(
        "Demonstration of System Deliverables",
        "Deliverables",
        [
            ("Live Workstation Web UI (Vercel)", "Features doctor sign-in, patient directory, CT drag-and-drop dropzone, and probability bar charts."),
            ("Production REST API (Render)", "OpenAPI/Swagger interactive documentation (/docs) managing predictions, reports, and chatbot queries."),
            ("Oncology Clinical AI Copilot", "Integrated LLM assistant answering diagnostic queries regarding confidence scores, IHC stains (TTF-1, p40), and treatment options.")
        ]
    )

    # SLIDE 20: Conclusion & Roadmap
    create_bullet_slide(
        "Conclusion & Review-3 Roadmap",
        "Conclusion",
        [
            ("Review-2 Accomplishments Completed", "Successfully built, validated, and deployed an attention-guided deep learning classifier achieving 94.80% accuracy."),
            ("Review-3 Enhancement 1: 3D Volumetric CT", "Extend 2D slice classification to 3D CT volume aggregation using 3D CNNs / Vision Transformers."),
            ("Review-3 Enhancement 2: Multi-Center Trial Data", "Validate model generalization across external healthcare repositories (LIDC-IDRI, TCIA)."),
            ("Review-3 Enhancement 3: Automated PDF Export", "Generate downloadable clinical PDF reports with structured patient metadata and XAI heatmap overlays.")
        ]
    )

    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Review2_Presentation_Mohammed_Izhan.pptx")
    prs.save(out_path)
    print(f"PowerPoint Presentation successfully created at: {out_path}")

if __name__ == "__main__":
    create_deck()
