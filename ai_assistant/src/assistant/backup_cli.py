from __future__ import annotations

import argparse
import shutil
from datetime import datetime
from pathlib import Path

from .config import load_settings


def backup(dest_dir: str) -> str:
    settings = load_settings()
    src = Path(settings.assistant_db_path)
    Path(dest_dir).mkdir(parents=True, exist_ok=True)
    ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    dest = Path(dest_dir) / f"assistant_memory_{ts}.sqlite3"
    shutil.copy2(src, dest)
    return str(dest)


def restore(src_file: str) -> None:
    settings = load_settings()
    dest = Path(settings.assistant_db_path)
    shutil.copy2(Path(src_file), dest)


def main() -> None:
    parser = argparse.ArgumentParser(prog="assistant-backup", description="Backup/Restore memory DB")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_b = sub.add_parser("backup")
    p_b.add_argument("dest_dir")

    p_r = sub.add_parser("restore")
    p_r.add_argument("src_file")

    args = parser.parse_args()
    if args.cmd == "backup":
        path = backup(args.dest_dir)
        print(path)
    elif args.cmd == "restore":
        restore(args.src_file)
        print("OK")


if __name__ == "__main__":
    main()