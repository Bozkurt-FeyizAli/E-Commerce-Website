import os

def generate_tree(path, prefix="", output_lines=None):
    """Recursively build the tree structure of a directory."""
    if output_lines is None:
        output_lines = []

    if not os.path.isdir(path):
        output_lines.append(f"{path} is not a directory.")
        return output_lines

    entries = sorted(os.listdir(path))
    total = len(entries)

    for index, entry in enumerate(entries):
        full_path = os.path.join(path, entry)
        connector = "└── " if index == total - 1 else "├── "

        output_lines.append(prefix + connector + entry)

        if os.path.isdir(full_path):
            extension = "    " if index == total - 1 else "│   "
            generate_tree(full_path, prefix + extension, output_lines)

    return output_lines

def write_tree_to_file(folder_path, output_file):
    tree_lines = generate_tree(folder_path)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(f"Tree view of: {os.path.abspath(folder_path)}\n\n")
        f.write("\n".join(tree_lines))
    print(f"Tree written to {output_file}")

# Example usage
if __name__ == "__main__":
    folder_path = "."  # Change to your target folder
    output_file = "tree_output.txt"
    write_tree_to_file(folder_path, output_file)
