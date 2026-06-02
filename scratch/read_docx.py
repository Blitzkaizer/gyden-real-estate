import zipfile
import xml.etree.ElementTree as ET
import os

def read_docx(file_path):
    if not os.path.exists(file_path):
        return f"File not found: {file_path}"
    try:
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Namespaces
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            # Extract text
            texts = []
            for paragraph in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                p_text = ""
                for run in paragraph.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}r'):
                    for text_node in run.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                        if text_node.text:
                            p_text += text_node.text
                if p_text:
                    texts.append(p_text)
            return "\n".join(texts)
    except Exception as e:
        return f"Error reading {file_path}: {e}"

# Test on SA001.docx and PIC_ Mindy.docx
p1 = r"Test folders/SA001 - PRIMA REGENCY/PRIVATE/SA001.docx"
p2 = r"Test folders/SA001 - PRIMA REGENCY/PRIVATE/PIC_ Mindy.docx"
print("=== SA001.docx ===")
print(read_docx(p1))
print("\n=== PIC_ Mindy.docx ===")
print(read_docx(p2))
