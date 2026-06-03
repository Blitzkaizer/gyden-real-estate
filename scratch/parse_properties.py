import os
import glob
import re
import shutil
import json
import zipfile
import xml.etree.ElementTree as ET

def read_docx(file_path):
    if not os.path.exists(file_path):
        return ""
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
                    texts.append(p_text.strip())
            return "\n".join(texts)
    except Exception as e:
        print(f"Error reading docx {file_path}: {e}")
        return ""

def parse_price(val):
    clean_val = val.lower().replace("rm", "").strip()
    multiplier = 1
    has_suffix = any(s in clean_val for s in ["mil", "m", "k"])
    if has_suffix:
        clean_val = clean_val.replace(",", ".")
        if "mil" in clean_val or "m" in clean_val:
            multiplier = 1000000
            clean_val = re.sub(r'million|mil|m', '', clean_val).strip()
        elif "k" in clean_val:
            multiplier = 1000
            clean_val = clean_val.replace("k", "").strip()
    else:
        clean_val = clean_val.replace(",", "")
        
    match = re.search(r'[\d\.]+', clean_val)
    if match:
        try:
            return int(float(match.group(0)) * multiplier)
        except ValueError:
            return 0
    return 0

def parse_docx_content(text, folder_name):
    # Try to parse properties from lines
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    data = {}
    
    # Extract ID from folder name (e.g., "SA001 - PRIMA REGENCY" -> "SA001")
    folder_id_match = re.match(r'^(SA\d+)', folder_name, re.IGNORECASE)
    prop_id = folder_id_match.group(1).upper() if folder_id_match else "UNKNOWN"
    
    # Strip ID and dash from folder name to get title as fallback
    clean_folder_title = re.sub(r'^SA\d+\s*-\s*', '', folder_name).strip()
    
    data["id"] = prop_id
    data["title"] = clean_folder_title
    data["raw_text"] = text
    
    # We can search lines for key fields
    # Initial defaults
    data["type"] = "Service Apartment"
    data["category"] = "Residential"
    data["price"] = "RM TBC"
    data["rawPrice"] = 0
    data["area"] = "TBC"
    data["location"] = "Johor Bahru"
    data["yield"] = "TBC"
    data["status"] = "Available"
    data["features"] = []
    data["googleMap"] = ""
    data["bedrooms"] = ""
    data["bathrooms"] = ""
    data["furnishing"] = "TBC"
    data["tenure"] = "Freehold"
    data["lot_type"] = "International Lot"
    data["maintenance_fee"] = "TBC"
    data["pic"] = "Gyden"
    data["unit_number"] = "TBC"
    data["rental_income"] = "TBC"
    data["remarks"] = ""
    
    # Parse title from second line if it looks like a title
    if len(lines) > 1 and not lines[1].startswith(("Google Map", "Property Type", "Selling Price", "Rental Price", "Bank Value")):
        # If second line isn't a key-value, it might be the actual title
        doc_title = lines[1]
        # Remove any "SA001" things from the title if present
        doc_title = re.sub(r'\bSA\d+\b', '', doc_title).strip()
        if doc_title:
            data["title"] = doc_title

    features_list = []
    remarks_section = False
    
    for line in lines:
        if "Remark" in line or "remark" in line.lower():
            remarks_section = True
            continue
        if remarks_section:
            # Skip remarks entirely to protect private client and property information
            continue
            
        # Parse fields
        lower_line = line.lower()
        if "google map:" in lower_line:
            data["googleMap"] = line.split(":", 1)[1].strip()
        elif "property type:" in lower_line:
            data["type"] = line.split(":", 1)[1].strip()
        elif "selling price:" in lower_line or "rental price:" in lower_line or "price:" in lower_line:
            val = line.split(":", 1)[1].strip()
            # Normalize nego/Nego to Negotiable
            val = re.sub(r'\bnego(tiable)?\b', 'Negotiable', val, flags=re.IGNORECASE)
            data["price"] = val
            data["rawPrice"] = parse_price(val)
        elif "build up area:" in lower_line or "built up area:" in lower_line:
            data["area"] = line.split(":", 1)[1].strip()
        elif "land size" in lower_line or "land area" in lower_line:
            # Append land size if present
            land_val = line.split(":", 1)[1].strip()
            if data["area"] == "TBC":
                data["area"] = land_val
            else:
                data["area"] += f" (Land: {land_val})"
        elif "freehold" in lower_line:
            data["tenure"] = "Freehold"
        elif "leasehold" in lower_line:
            data["tenure"] = "Leasehold"
            # Try to grab duration if any
            match = re.search(r'leasehold.*', line, re.IGNORECASE)
            if match:
                data["tenure"] = match.group(0)
        elif "international lot" in lower_line:
            data["lot_type"] = "International Lot"
        elif "non bumi" in lower_line:
            data["lot_type"] = "Non Bumi Lot"
        elif "bumi" in lower_line:
            data["lot_type"] = "Bumi Lot"
        elif "rental income:" in lower_line:
            data["rental_income"] = line.split(":", 1)[1].strip()
        elif "maintenance fee:" in lower_line:
            data["maintenance_fee"] = line.split(":", 1)[1].strip()
        elif "fully furnished" in lower_line:
            data["furnishing"] = "Fully Furnished"
            features_list.append("Fully Furnished")
        elif "partial furnished" in lower_line or "partially furnished" in lower_line:
            data["furnishing"] = "Partial Furnished"
            features_list.append("Partial Furnished")
        elif "unfurnished" in lower_line or "bare" in lower_line:
            data["furnishing"] = "Unfurnished"
            
        # Try to parse layout (e.g. 2 Bedroom 2 Bathroom)
        layout_match = re.search(r'(\d+(?:\+\d+)?)\s*bedroom\s*(\d+)\s*bathroom', line, re.IGNORECASE)
        if layout_match:
            data["bedrooms"] = layout_match.group(1)
            data["bathrooms"] = layout_match.group(2)
        elif "studio" in lower_line:
            data["bedrooms"] = "Studio"
            data["bathrooms"] = "1"
            
        # Collect random single-word or short-phrase descriptors as features
        if line in ["Freehold", "International Lot", "Non Bumi Lot", "Bumi Lot", "Strata Title", "Individual Title", "Tenanted", "Vacant", "Pool View", "City View", "Sea View", "Gated & Guarded: Yes", "Gated & Guarded: No", "Original", "Renovated"]:
            features_list.append(line)
        elif "gated & guarded" in lower_line:
            if "yes" in lower_line or "1" in lower_line:
                features_list.append("Gated & Guarded")
        elif "carpark" in lower_line or "car park" in lower_line:
            features_list.append(line)

    data["features"] = list(set(features_list))
    
    # Determine category based on type or listing info
    lower_type = data["type"].lower()
    if any(k in lower_type for k in ["apartment", "condo", "villa", "bungalow", "terrace", "semi-d", "residential", "house", "gardenlink", "townhouse"]):
        data["category"] = "Residential"
    elif any(k in lower_type for k in ["office", "retail", "shop", "commercial", "hub"]):
        data["category"] = "Commercial"
    elif any(k in lower_type for k in ["industrial", "land", "factory", "warehouse"]):
        data["category"] = "Industrial / Land"
    else:
        # Check text content for category clues
        if "apartment listing" in text.lower() or "house listing" in text.lower():
            data["category"] = "Residential"
        elif "commercial listing" in text.lower() or "shop listing" in text.lower():
            data["category"] = "Commercial"
        elif "industrial listing" in text.lower() or "land listing" in text.lower():
            data["category"] = "Industrial / Land"
            
    # Try to calculate yield if rental income is available and selling price is available
    if data["rental_income"] != "TBC" and data["rawPrice"] > 0:
        # Extract rental amount
        rent_num = re.findall(r'\d+', data["rental_income"].replace(",", ""))
        if rent_num:
            rent_val = int("".join(rent_num))
            if rent_val > 0:
                calc_yield = (rent_val * 12) / data["rawPrice"] * 100
                data["yield"] = f"{calc_yield:.1f}%"
    
    # Try to extract location from text or title
    loc_candidates = ["Danga Bay", "Skudai", "Iskandar Puteri", "Medini", "Senai", "Kulai", "Pasir Gudang", "Taman Daya", "Johor Bahru", "Seri Alam", "Mount Austin", "Permas Jaya", "Desaru", "Simpang Renggam", "Pekan Nanas"]
    for loc in loc_candidates:
        if loc.lower() in data["title"].lower() or loc.lower() in text.lower():
            data["location"] = f"{loc}, Johor Bahru" if loc != "Johor Bahru" else "Johor Bahru"
            break
            
    return data

def parse_pic_docx(text):
    # Parse PIC details from the text
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    pic = "Gyden"
    unit_number = "TBC"
    for line in lines:
        lower_line = line.lower()
        if "pic:" in lower_line:
            pic = line.split(":", 1)[1].strip()
        elif "lot or unit number:" in lower_line or "lot/unit number:" in lower_line:
            unit_number = line.split(":", 1)[1].strip()
        elif line.startswith("Blk") or line.startswith("No"):
            unit_number = line
    return pic, unit_number

def run_parser():
    print("Starting parser...")
    folders = sorted(glob.glob("Test folders/SA*"))
    print(f"Found {len(folders)} property folders.")
    
    properties_list = []
    
    # Ensure public folder exists
    public_img_dir = "public/property-images"
    os.makedirs(public_img_dir, exist_ok=True)
    
    # For fallback mapping
    fallback_images = [
        "/assets/images/property_sa001.png",
        "/assets/images/property_sa002.png",
        "/assets/images/property_sa003.png"
    ]
    
    for i, folder in enumerate(folders):
        folder_name = os.path.basename(folder)
        # Find main docx file
        # Check root of folder and PRIVATE subfolder
        docx_files = glob.glob(os.path.join(folder, "*.docx")) + glob.glob(os.path.join(folder, "PRIVATE", "*.docx"))
        
        main_docx = None
        pic_docx = None
        
        for df in docx_files:
            df_name = os.path.basename(df)
            if df_name.startswith("PIC_"):
                pic_docx = df
            elif re.match(r'^SA\d+\.docx', df_name, re.IGNORECASE):
                main_docx = df
            elif not main_docx:
                main_docx = df
                
        # Parse main docx
        main_text = ""
        if main_docx:
            main_text = read_docx(main_docx)
            
        # Parse pic docx
        pic_text = ""
        if pic_docx:
            pic_text = read_docx(pic_docx)
            
        # Parse details
        prop_data = parse_docx_content(main_text, folder_name)
        
        if pic_text:
            pic, unit = parse_pic_docx(pic_text)
            prop_data["pic"] = pic
            prop_data["unit_number"] = unit
            
        # Clean title: Remove SA001 - from front and capitalization
        title = prop_data["title"]
        # E.g., "PRIMA REGENCY" or "CELLO TEBRAU@DESA TEBRAU"
        # Make title look cleaner (e.g. Title Case or keep Uppercase but remove codes)
        title = re.sub(r'^SA\d+\s*-\s*', '', title, flags=re.IGNORECASE)
        # Remove any lingering "SA\d+"
        title = re.sub(r'\bSA\d+\b', '', title, flags=re.IGNORECASE).strip(" -")
        prop_data["title"] = title
        
        # Look for images inside the folder
        img_extensions = ["*.jpeg", "*.jpg", "*.png", "*.webp"]
        images = []
        for ext in img_extensions:
            images += glob.glob(os.path.join(folder, ext))
            
        if not images:
            # Skip properties without real screenshots
            continue
            
        prop_data["images"] = []
        
        # Find WhatsApp images or others
        images = sorted(images)
        for idx, img_path in enumerate(images):
            file_ext = os.path.splitext(img_path)[1].lower()
            dest_name = f"{prop_data['id']}_{idx+1}{file_ext}"
            dest_path = os.path.join(public_img_dir, dest_name)
            try:
                shutil.copy2(img_path, dest_path)
                prop_data["images"].append(f"/property-images/{dest_name}")
            except Exception as e:
                print(f"Error copying image {img_path}: {e}")
                
        if not prop_data["images"]:
            continue
            
        prop_data["image"] = prop_data["images"][0]
        properties_list.append(prop_data)
        
        if (i+1) % 50 == 0 or (i+1) == len(folders):
            print(f"Processed {i+1}/{len(folders)} properties...")
            
    # Save the parsed database to src/data/properties_data.json
    os.makedirs("src/data", exist_ok=True)
    with open("src/data/properties_data.json", "w", encoding="utf-8") as f:
        json.dump(properties_list, f, indent=2, ensure_ascii=False)
        
    print(f"Saved {len(properties_list)} parsed properties to src/data/properties_data.json.")

if __name__ == "__main__":
    run_parser()
