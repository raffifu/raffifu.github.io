import os
import glob

def convert_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
        
    try:
        sep_index = lines.index('~~~~~~\n')
    except ValueError:
        return # Skip if no JBake separator
        
    frontmatter_lines = lines[:sep_index]
    content_lines = lines[sep_index+1:]
    
    yaml_lines = ['---\n']
    for line in frontmatter_lines:
        if '=' in line:
            key, val = line.strip().split('=', 1)
            # Quote values to ensure valid YAML, especially for dates or titles with colons
            yaml_lines.append(f'{key}: "{val}"\n')
            
    yaml_lines.append('---\n')
    
    with open(filepath, 'w') as f:
        f.writelines(yaml_lines + content_lines)
        
if __name__ == '__main__':
    md_files = glob.glob('content/**/*.md', recursive=True)
    for filepath in md_files:
        convert_file(filepath)
    print(f"Converted {len(md_files)} files.")
