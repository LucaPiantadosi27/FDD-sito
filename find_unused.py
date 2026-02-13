import os
import re

# Directories to search
base_dir = r"c:\PROGETTI IT CONSULTING\FDD-sito"
img_dir = os.path.join(base_dir, "img")

# File extensions to check for references
search_extensions = [".html", ".css", ".scss", ".js"]

# Find all images in img/
image_files = []
for root, dirs, files in os.walk(img_dir):
    for file in files:
        if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.heic')):
            # Store relative path from base_dir with forward slashes
            rel_path = os.path.relpath(os.path.join(root, file), base_dir).replace("\\", "/")
            image_files.append(rel_path)

print(f"Total images found: {len(image_files)}")

# Find all references in codebase
references = set()
for root, dirs, files in os.walk(base_dir):
    # Skip .git, nodes, etc.
    if any(ex in root for ex in [".git", "node_modules"]):
        continue
    for file in files:
        if any(file.lower().endswith(ext) for ext in search_extensions):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    # Find all "img/..." strings
                    found = re.findall(r'img/[^\"\'\s>)]+', content)
                    for ref in found:
                        # Clean ref (remove potential trailing characters if regex was too broad)
                        # But generally image files are what we want
                        references.add(ref.strip().replace("\\", "/"))
            except Exception as e:
                print(f"Error reading {file_path}: {e}")

# Intersection/Difference
unused_images = []
for img in image_files:
    if img not in references:
        # Extra check: sometimes refs don't have extension or use different pathing
        # But here we follow the "img/..." convention
        unused_images.append(img)

print(f"Unused images found: {len(unused_images)}")
with open(os.path.join(base_dir, "unused_report.txt"), "w") as f:
    for img in unused_images:
        f.write(img + "\n")

print("Report saved to unused_report.txt")
