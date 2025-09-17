from __future__ import annotations

import argparse
import asyncio

from .engine import AssistantEngine


def cmd_chat(session_id: str) -> None:
    engine = AssistantEngine(session_id=session_id)
    print("Open Assistant — type /exit to quit\n")
    while True:
        try:
            user_input = input("You > ")
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye.")
            break
        if user_input.strip() in {"/exit", ":q", "/quit"}:
            print("Goodbye.")
            break
        content = asyncio.run(engine.chat_once(user_input))
        print(f"Assistant: {content}\n")


def cmd_tools() -> None:
    from .tools import get_tools

    print("Available tools:")
    for name in get_tools().keys():
        print(f"- {name}")


def main() -> None:
    parser = argparse.ArgumentParser(prog="assistant", description="Open Assistant CLI (stdlib)")
    sub = parser.add_subparsers(dest="command", required=True)

    chat_p = sub.add_parser("chat", help="Start interactive chat")
    chat_p.add_argument("--session-id", default="default")

    sub.add_parser("tools", help="List tools")

    args = parser.parse_args()

    if args.command == "chat":
        cmd_chat(session_id=args.session_id)
    elif args.command == "tools":
        cmd_tools()


if __name__ == "__main__":
    main()