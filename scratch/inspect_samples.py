import zipfile
import xml.etree.ElementTree as ET
import os
import glob

def read_docx(file_path):
    if not os.path.exists(file_path):
        return f"File not found: {file_path}"
    try:
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read('word/document.xml')
            root = ET.fromstring(xml_content)
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

# Sample 5 different docx files from different folders
folders = sorted(glob.glob("Test folders/SA*"))
samples = [folders[i] for i in [4, 14, 54, 154, 254] if i < len(folders)]

for folder in samples:
    print("="*40)
    print(f"Folder: {folder}")
    # find docx in PRIVATE
    private_dir = os.path.join(folder, "PRIVATE")
    if os.path.exists(private_dir):
        docx_files = [f for f in os.listdir(private_dir) if f.endswith(".docx") and not f.startswith("PIC_")]
        if docx_files:
            docx_path = os.path.join(private_dir, docx_files[0])
            print(f"File: {docx_path}")
            print(read_docx(docx_path))
        
        pic_files = [f for f in os.listdir(private_dir) if f.startswith("PIC_")]
        if pic_files:
            pic_path = os.path.join(private_dir, pic_files[0])
            print(f"PIC File: {pic_path}")
            print(read_docx(pic_path))
