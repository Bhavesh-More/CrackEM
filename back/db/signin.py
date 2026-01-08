from pymongo import MongoClient
import bcrypt

client = MongoClient("mongodb://localhost:27017/")
db = client["CrackEM"]
users = db["users"]

def getUser(email: str, password):
    user = users.find_one({"email": email})
    if user:
        # Verify password with bcrypt
        if bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
            return {
                "status": "success",
                "user": {
                    "name": user["name"],
                    "email": user["email"]
                }
            }
        else:
            return {
                "status": "error",
                "message": "Invalid password"
            }
    else:
        return {
            "status": "error",
            "message": "User not found"
        }
# print(getUser("Test User", "test@123", "password123"))