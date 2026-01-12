from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['CrackEM']
messages = db["messages"]

def getMeetMessages(meetID: str):
    cursor = messages.find(
        {"meet_id": meetID}
    ).sort("timestamp", 1)

    result_lines = []

    for msg in cursor:
        sender = msg.get("sender", "unknown")
        text = msg.get("message", "").strip()

        # normalize sender name
        sender = sender.lower()

        if sender == "jarvis":
            sender_label = "Jarvis"
        elif sender == "user":
            sender_label = "User"
        else:
            sender_label = sender.capitalize()

        result_lines.append(f"{sender_label}: {text}")

    print("done")
    return "\n".join(result_lines)

print(getMeetMessages("dlxwf5q1d2et57znsf2nn"))