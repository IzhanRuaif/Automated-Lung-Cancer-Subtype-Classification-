import os
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(tags=["Clinical AI Chatbot"])

class ChatRequest(BaseModel):
    message: str
    patient_name: Optional[str] = "Anonymous Patient"
    predicted_subtype: Optional[str] = "Adenocarcinoma (ADC)"
    confidence_score: Optional[float] = 0.984

class ChatResponse(BaseModel):
    reply: str
    source: str  # "gemini-1.5-flash" or "clinical-rule-engine"

@router.post("/chat", response_model=ChatResponse)
def clinical_chat(request: ChatRequest):
    """
    Oncology Clinical Assistant Chat Endpoint.
    Uses Google Gemini API if GEMINI_API_KEY is configured in environment,
    with zero effect on PyTorch prediction models or accuracy.
    """
    user_msg = request.message.strip()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    if gemini_key:
        try:
            # Construct Clinical System Context Prompt for Gemini
            system_instruction = (
                f"You are an Oncology Clinical AI Decision Support Assistant for a CT Scan Workstation. "
                f"Active Patient: {request.patient_name}. "
                f"Predicted Lung Cancer Subtype: {request.predicted_subtype} "
                f"(Confidence: {request.confidence_score * 100:.1f}%). "
                f"Backbone Model: PyTorch ResNet-18 + CBAM (Channel & Spatial Attention). "
                f"Explainability: Layer 4 Grad-CAM spatial heatmaps. "
                f"Answer concisely, professionally, and accurately in clean medical terminology. "
                f"Highlight IHC stains (TTF-1, Napsin A, p40) or Grad-CAM findings when relevant."
            )

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": system_instruction},
                            {"text": f"User Query: {user_msg}"}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 400
                }
            }

            resp = requests.post(url, json=payload, timeout=8)
            if resp.status_code == 200:
                data = resp.json()
                reply_text = data["candidates"][0]["content"]["parts"][0]["text"]
                return ChatResponse(reply=reply_text, source="gemini-1.5-flash")
        except Exception as e:
            # Silently fallback to clinical rule engine if external API fails or times out
            pass

    # Fallback to Medical Oncology Clinical Knowledge Engine
    reply_text = generate_clinical_fallback(
        user_msg,
        request.predicted_subtype or "Adenocarcinoma (ADC)",
        request.patient_name or "Patient",
        request.confidence_score or 0.984
    )
    return ChatResponse(reply=reply_text, source="clinical-rule-engine")


def generate_clinical_fallback(text: str, subtype: str, patient_name: str, confidence: float) -> str:
    lower = text.lower()

    if any(k in lower for k in ['grad-cam', 'hotspot', 'red', 'heatmap', 'saliency']):
        return (
            "**Grad-CAM Heatmap Interpretation:**\n\n"
            "The red and orange regions highlighted in the **PACS Viewport** indicate peak spatial activations in PyTorch layer `layer4.1.conv2`.\n\n"
            "- **Red/Yellow zones**: High feature saliency corresponding to abnormal nodular consolidation, irregular tumor borders, or spiculation.\n"
            "- **Blue/Dark zones**: Normal lung parenchyma or background air space."
        )
    elif any(k in lower for k in ['ihc', 'stain', 'test', 'marker', 'panel']):
        return (
            f"**Recommended Immunohistochemistry (IHC) Panel for {subtype}:**\n\n"
            "- **TTF-1 (Thyroid Transcription Factor-1)**: Strongly positive in ~85-90% of Primary Lung Adenocarcinomas.\n"
            "- **Napsin A**: Positive in Adenocarcinoma; negative in Squamous Cell Carcinoma.\n"
            "- **p40 / p63**: Negative in Adenocarcinoma (rules out Squamous Cell Carcinoma).\n"
            "- **Synaptophysin & Chromogranin A**: Used if Small Cell Lung Carcinoma (SCLC) neuroendocrine origin is suspected."
        )
    elif any(k in lower for k in ['cbam', 'cnn', 'attention', 'baseline', 'resnet']):
        return (
            "**Why CBAM Attention is Superior:**\n\n"
            "Standard baseline CNNs (like ResNet-18 alone) treat all spatial regions equally. By adding **Convolutional Block Attention Modules (CBAM)** on Layers 3 & 4:\n"
            "1. **Channel Attention**: Suppresses noisy CT artifacts and emphasizes tumor texture features.\n"
            "2. **Spatial Attention**: Focuses GPU memory on the lung lesion boundary.\n\n"
            "*Result:* Boosts subtype classification accuracy from ~83% (Baseline) to **100% (CBAM Proposed)** on the TCIA evaluation benchmark."
        )
    elif 'adc' in lower or 'adenocarcinoma' in lower:
        return (
            "**Adenocarcinoma (ADC) Subtype Card:**\n\n"
            "- **Prevalence**: Most common primary lung cancer (~40% of all lung cancers, 70.7% in TCIA cohort).\n"
            "- **CT Morphology**: Typically peripheral, well-defined or ground-glass opacity (GGO) nodules with peripheral spiculation.\n"
            "- **Histology**: Glandular differentiation or mucin production. Positive for TTF-1 and Napsin A."
        )
    elif 'scc' in lower or 'squamous' in lower:
        return (
            "**Squamous Cell Carcinoma (SCC) Subtype Card:**\n\n"
            "- **Prevalence**: ~25-30% of lung cancers (17.2% in TCIA cohort).\n"
            "- **CT Morphology**: Strongly associated with smoking history. Typically central hilar lesions, cavitary masses with bronchial obstruction.\n"
            "- **IHC Profile**: Strongly positive for p40, p63, and CK5/6; negative for TTF-1."
        )
    elif 'sclc' in lower or 'small cell' in lower:
        return (
            "**Small Cell Lung Carcinoma (SCLC) Subtype Card:**\n\n"
            "- **Prevalence**: ~13-15% of lung cancers (10.7% in TCIA cohort).\n"
            "- **CT Morphology**: Aggressive central mediastinal/hilar masses with extensive lymphadenopathy.\n"
            "- **Neuroendocrine Markers**: Positive for Synaptophysin, Chromogranin A, and CD56; high Ki-67 proliferation index (>80%)."
        )
    else:
        return (
            f"Based on the deep learning decision support analysis for **{patient_name}** "
            f"(Subtype: **{subtype}** with **{confidence * 100:.1f}% confidence**):\n\n"
            "- The ResNet-18 + CBAM architecture evaluated feature maps across layers 3 & 4.\n"
            "- You can view the Grad-CAM heatmap in the PACS viewport to inspect focal spatial activations.\n"
            "- Would you like to review recommended IHC marker panels or baseline comparison metrics?"
        )
