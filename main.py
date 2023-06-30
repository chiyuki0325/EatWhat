import asyncio
from pyrogram import Client
from config import config
import json
from os.path import exists


async def main():
    members: list[list[str]] = []
    print("正在获取群成员列表……")
    async with Client("EatWhat", config.api_id, config.api_hash) as app:
        async for member in app.get_chat_members(config.chat_id):
            if not member.user.is_bot:
                member_name: str = member.user.first_name
                if member.user.last_name is not None:
                    member_name += " " + member.user.last_name
                if ' | ' in member_name:
                    member_name = member_name.split(' | ')[0]

                if member.user.photo is not None:
                    photo_id: str = member.user.photo.small_file_id
                else:
                    photo_id: str = "0"
                members.append(
                    [member_name, photo_id]
                )
        for easter_egg_member in config.easter_eggs:
            members.append([easter_egg_member, "0"])
        members.sort(key=lambda x: x[0])
        with open("web/member_list.js", "w") as f:
            f.write("// Auto generated from Telegram data\n")
            f.write("export default " + json.dumps(members, ensure_ascii=False))
        print("已写入文件")

        print("正在下载头像……")
        for member in members:
            if member[1] != "0":
                path: str = f"web/images/{member[1]}.jpg"
                if not exists(path):
                    print(f"  正在下载 {member[0]} 的头像……")
                    await app.download_media(member[1], file_name=path)


if __name__ == "__main__":
    asyncio.run(main())
