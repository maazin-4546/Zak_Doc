import sys
import json
import pdfplumber

def extract_text_from_pdf(pdf_path):
    extracted_text = ""
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                extracted_text += page.extract_text() + "\n\n"  
        
        if not extracted_text.strip():
            raise ValueError("No text extracted from the PDF. Ensure it's not a scanned document.")
        
        print(json.dumps({"text": extracted_text}))  

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    extract_text_from_pdf(sys.argv[1])
