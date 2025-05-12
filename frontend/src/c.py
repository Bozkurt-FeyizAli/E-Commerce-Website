import os
from graphviz import Digraph

# Kök klasör (c.py ile aynı klasördeki app)
BASE_DIR = os.path.join(os.path.dirname(__file__), "app")
IGNORED_EXTENSIONS = [".html", ".css", ".scss", "ts", "manage-products", "banner", "featured-pro", "new-arriva", "anaytics", "complaints", "paymrnts", "profile", "review-mana", "shipment-tra", "transaction"]
MAX_DEPTH = 8
MAX_CHILDREN_PER_ROW = 8

def is_valid_file(filename):
    return filename.endswith(".ts") and not any(filename.endswith(ext) for ext in IGNORED_EXTENSIONS)

def get_node_id(path):
    return path.replace("/", "_").replace(".", "_")

def build_tree(dot, parent_id, current_path, depth=0):
    if depth > MAX_DEPTH:
        return

    try:
        entries = os.listdir(current_path)
    except Exception:
        return

    dirs = sorted([e for e in entries if os.path.isdir(os.path.join(current_path, e))])
    files = sorted([e for e in entries if os.path.isfile(os.path.join(current_path, e))])

    # Klasörleri çiz
    for i, folder in enumerate(dirs):
        if i > 0 and i % MAX_CHILDREN_PER_ROW == 0:
            dot.attr(rank="same")  # yeni satıra geç

        child_path = os.path.join(current_path, folder)
        node_id = get_node_id(child_path)
        dot.node(node_id, folder, shape="box")
        dot.edge(parent_id, node_id)
        build_tree(dot, node_id, child_path, depth + 1)

    # Dosyaları çiz
    for i, file in enumerate(files):
        if is_valid_file(file):
            if i > 0 and i % MAX_CHILDREN_PER_ROW == 0:
                dot.attr(rank="same")
            file_path = os.path.join(current_path, file)
            node_id = get_node_id(file_path)
            dot.node(node_id, file)
            dot.edge(parent_id, node_id)

def main():
    dot = Digraph(comment="Angular Project Tree", format="png")
    dot.attr(rankdir="TB", ranksep="0.4", nodesep="0.3")  # yön: yukarıdan aşağı
    root_id = get_node_id(BASE_DIR)
    dot.node(root_id, "app", shape="box")
    build_tree(dot, root_id, BASE_DIR)
    dot.render("angular_tree", view=True)
    print("✅ Grafik oluşturuldu: angular_tree.png")

if __name__ == "__main__":
    main()
